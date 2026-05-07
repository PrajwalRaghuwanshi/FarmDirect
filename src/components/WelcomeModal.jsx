import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Phone, UserRound, ArrowRight, X, Loader2, ShieldCheck, Mail } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function WelcomeModal() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1 = form, 2 = OTP
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  useEffect(() => {
    const isSigned = localStorage.getItem('farmdirect-user')
    const hasSeenWelcome = sessionStorage.getItem('farmdirect-seen-welcome')
    
    if (!isSigned && !hasSeenWelcome) {
      // Show modal after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('farmdirect-seen-welcome', 'true')
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1200)
  }

  const handleVerify = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const userData = { name, email, mobile }
      login(userData)
      sessionStorage.setItem('farmdirect-seen-welcome', 'true')
      setIsOpen(false)
      window.location.reload()
    }, 1500)
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) {
      const nextOtp = [...otp]
      pasted.split('').forEach((char, i) => {
        if (i < 6) nextOtp[i] = char
      })
      setOtp(nextOtp)
    }
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const nextOtp = [...otp]
    nextOtp[i] = val.slice(-1)
    setOtp(nextOtp)
    
    // Auto-focus next input
    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`)
      nextInput?.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Click to close disabled */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-xl shadow-emerald-600/20">
              <Leaf size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {step === 1 ? 'Welcome to FarmDirect' : 'Verify Identity'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {step === 1 
                ? 'Join our community for fresh harvests.' 
                : 'Enter the 6-digit code sent to your mobile.'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      Sign In Now
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  Skip for Now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input 
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={loading || otp.some(digit => !digit)}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <ShieldCheck size={18} />
                      Verify & Access
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  Skip for Now
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500 px-6">
            By continuing, you agree to our Terms of Service and Privacy Policy. Your data is protected by farm-grade security.
          </p>
        </div>
      </div>
    </div>
  )
}
