
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Phone, UserRound, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { useUser } from '../context/UserContext'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 30

export default function SignInPage() {
  const navigate = useNavigate()
  const { login } = useUser()

  /* ───── state ───── */
  const [step, setStep] = useState(1) // 1 = form, 2 = OTP
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [errors, setErrors] = useState({})
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otpError, setOtpError] = useState('')
  const [animating, setAnimating] = useState(false)

  const otpRefs = useRef([])

  /* ───── resend countdown ───── */
  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  /* ───── validation ───── */
  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!mobile.trim()) {
      e.mobile = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      e.mobile = 'Enter a valid 10-digit mobile number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ───── step 1 → step 2 ───── */
  function handleSendOtp(e) {
    e.preventDefault()
    if (!validate()) return

    setSending(true)
    // simulate OTP send
    setTimeout(() => {
      setSending(false)
      setAnimating(true)
      setTimeout(() => {
        setStep(2)
        setResendTimer(RESEND_COOLDOWN)
        setAnimating(false)
      }, 350)
    }, 1200)
  }

  /* ───── OTP input handlers ───── */
  const handleOtpChange = useCallback(
    (index, value) => {
      if (!/^\d?$/.test(value)) return
      setOtpError('')
      const next = [...otp]
      next[index] = value
      setOtp(next)
      if (value && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus()
      }
    },
    [otp],
  )

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    otpRefs.current[focusIdx]?.focus()
  }

  /* ───── verify OTP ───── */
  function handleVerifyOtp(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setOtpError('Please enter the full OTP')
      return
    }

    setVerifying(true)
    // simulate verification
    setTimeout(() => {
      setVerifying(false)
      // success — save user and navigate home
      login({ name, mobile })
      window.location.href = '/'
    }, 1500)
  }

  /* ───── resend OTP ───── */
  function handleResend() {
    if (resendTimer > 0) return
    setOtp(Array(OTP_LENGTH).fill(''))
    setOtpError('')
    setResendTimer(RESEND_COOLDOWN)
  }

  /* ───── masked mobile ───── */
  const maskedMobile = mobile.length >= 4 ? '••••••' + mobile.slice(-4) : mobile

  /* ────────────────────── UI ────────────────────── */
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/5" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-2xl dark:bg-emerald-600/5" />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-500 ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
      >
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-emerald-900/5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-emerald-400/5">
          {/* Header */}
          <div className="flex flex-col items-center px-8 pt-10 pb-2">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              {step === 1 ? (
                <UserRound size={30} className="text-white" strokeWidth={1.8} />
              ) : (
                <ShieldCheck size={30} className="text-white" strokeWidth={1.8} />
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {step === 1 ? 'Welcome to FarmDirect' : 'Verify Your Number'}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              {step === 1
                ? 'Sign in to access fresh farm produce delivered to your doorstep.'
                : (
                  <>
                    Enter the 6-digit code sent to{' '}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {maskedMobile}
                    </span>
                  </>
                )}
            </p>
          </div>

          {/* ─── Step 1: Name & Mobile ─── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5 px-8 pt-6 pb-10">
              {/* Name */}
              <div>
                <label
                  htmlFor="signin-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="signin-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                    }}
                    placeholder="Enter your full name"
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-700/60 dark:text-white dark:placeholder:text-slate-500 ${errors.name
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-600 dark:focus:border-emerald-500'
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="signin-mobile"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    +91
                  </span>
                  <input
                    id="signin-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setMobile(v)
                      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }))
                    }}
                    placeholder="98765 43210"
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-[5.5rem] pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-700/60 dark:text-white dark:placeholder:text-slate-500 ${errors.mobile
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-600 dark:focus:border-emerald-500'
                      }`}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.mobile}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP…
                  </>
                ) : (
                  <>
                    Get OTP
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                By signing in, you agree to our{' '}
                <span className="cursor-pointer font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="cursor-pointer font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                  Privacy Policy
                </span>
              </p>
            </form>
          )}

          {/* ─── Step 2: OTP Verification ─── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 px-8 pt-6 pb-10">
              {/* OTP Boxes */}
              <div className="flex items-center justify-center gap-2.5" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold text-slate-900 outline-none transition-all dark:bg-slate-700/60 dark:text-white ${digit
                        ? 'border-emerald-500 shadow-sm shadow-emerald-500/15 dark:border-emerald-500'
                        : 'border-slate-200 dark:border-slate-600'
                      } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-center text-xs font-medium text-rose-500">{otpError}</p>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifying || otp.some(digit => !digit)}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify & Sign In
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="font-medium text-slate-400 dark:text-slate-500">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>

              {/* Change number */}
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp(Array(OTP_LENGTH).fill(''))
                  setOtpError('')
                }}
                className="mx-auto flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <ArrowRight size={12} className="rotate-180" />
                Change mobile number
              </button>
            </form>
          )}
        </div>

        {/* Brand footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Leaf size={14} className="text-emerald-500" />
          <span>FarmDirect — From Farm. To You.</span>
        </div>
      </div>
    </section>
  )
}
