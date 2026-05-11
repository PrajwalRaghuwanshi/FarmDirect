import { useState, useEffect } from 'react'
import { X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OtpVerificationModal({ isOpen, onClose, onVerify, mobileNumber, loading }) {
  const { t } = useTranslation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setError('')
    }
  }, [isOpen])

  const maskMobile = (mobile) => {
    if (!mobile) return '******'
    const str = mobile.toString()
    return '*'.repeat(str.length - 4) + str.slice(-4)
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const nextOtp = [...otp]
    nextOtp[i] = val.slice(-1)
    setOtp(nextOtp)
    
    if (val && i < 5) {
      const nextInput = document.getElementById(`settings-otp-${i + 1}`)
      nextInput?.focus()
    }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    // For demo purposes, any 6 digit OTP works
    onVerify(fullOtp)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-xl shadow-emerald-600/20">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Verify OTP
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              OTP sent to {maskMobile(mobileNumber)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input 
                  key={i}
                  id={`settings-otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button 
                disabled={loading || otp.some(digit => !digit)}
                type="submit"
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ShieldCheck size={18} />
                    Confirm & Update
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
