import { useState, useEffect } from 'react'
import { X, Loader2, ShieldCheck, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ProfileUpdateModal({ isOpen, onClose, type, currentValue, onUpdate }) {
  const [step, setStep] = useState(1) // 1: Old, 2: Old OTP, 3: New, 4: New OTP, 5: Success
  const [oldValue, setOldValue] = useState('')
  const [newValue, setNewValue] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setOldValue('')
      setNewValue('')
      setOtp(['', '', '', '', '', ''])
      setError('')
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const label = type === 'mobile' ? 'Mobile Number' : 'Email Address'
  const Icon = type === 'mobile' ? Phone : Mail

  const handleNext = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API calls
    setTimeout(() => {
      setLoading(false)
      if (step === 1) {
        if (oldValue !== currentValue) {
          setError(`Incorrect old ${label.toLowerCase()}`)
          return
        }
        setStep(2)
      } else if (step === 2) {
        setStep(3)
        setOtp(['', '', '', '', '', ''])
      } else if (step === 3) {
        if (!newValue) {
          setError(`Please enter new ${label.toLowerCase()}`)
          return
        }
        if (newValue === currentValue) {
          setError(`New ${label.toLowerCase()} cannot be same as old one`)
          return
        }
        setStep(4)
      } else if (step === 4) {
        onUpdate(newValue)
        setStep(5)
      }
    }, 1000)
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const nextOtp = [...otp]
    nextOtp[i] = val.slice(-1)
    setOtp(nextOtp)
    if (val && i < 5) {
      document.getElementById(`update-otp-${i + 1}`)?.focus()
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Old {label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type={type === 'mobile' ? 'tel' : 'email'}
                  value={oldValue}
                  onChange={(e) => setOldValue(type === 'mobile' ? e.target.value.replace(/\D/g, '') : e.target.value.toLowerCase())}
                  placeholder={`Enter current ${label.toLowerCase()}`}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500 text-center">{error}</p>}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Next <ArrowRight size={18} /></>}
            </button>
          </form>
        )
      case 2:
      case 4:
        return (
          <form onSubmit={handleNext} className="space-y-8">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Enter the 6-digit OTP sent to {step === 2 ? 'your old' : 'your new'} {label.toLowerCase()}
              </p>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`update-otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                ))}
              </div>
            </div>
            <button
              disabled={loading || otp.some(d => !d)}
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify OTP <ShieldCheck size={18} /></>}
            </button>
          </form>
        )
      case 3:
        return (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enter New {label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type={type === 'mobile' ? 'tel' : 'email'}
                  value={newValue}
                  onChange={(e) => setNewValue(type === 'mobile' ? e.target.value.replace(/\D/g, '') : e.target.value.toLowerCase())}
                  placeholder={`Enter new ${label.toLowerCase()}`}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-500 text-center">{error}</p>}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send OTP <ArrowRight size={18} /></>}
            </button>
          </form>
        )
      case 5:
        return (
          <div className="text-center py-4 space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Successfully Updated!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Your {label.toLowerCase()} has been verified and updated.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold transition-all active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Update {label}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Secure {step < 5 ? `Step ${step} of 4` : 'Complete'}
            </p>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  )
}
