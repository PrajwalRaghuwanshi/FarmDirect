import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Phone, UserRound, ArrowRight, X, Loader2, ShieldCheck, Mail, MapPin, LogIn, UserPlus } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

export default function WelcomeModal() {
  const navigate = useNavigate()
  const { login, updatePincode, pincode: storedPincode } = useUser()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  // steps: 'choice' | 'register' | 'signin' | 'otp' | 'pincode'
  const [step, setStep] = useState('choice')
  const [authMode, setAuthMode] = useState('register') // tracks which path the user chose
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [signinValue, setSigninValue] = useState('') // mobile or email for sign-in
  const [tempPincode, setTempPincode] = useState(storedPincode || '')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  useEffect(() => {
    const isSigned = localStorage.getItem('farmdirect-user')
    const hasSeenWelcome = sessionStorage.getItem('farmdirect-seen-welcome')
    
    if (!isSigned && !hasSeenWelcome) {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('farmdirect-seen-welcome', 'true')
  }

  // Register form submit → go to OTP
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAuthMode('register')
      setStep('otp')
    }, 1200)
  }

  // Sign In form submit → go to OTP
  const handleSigninSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAuthMode('signin')
      setStep('otp')
    }, 1200)
  }

  // OTP verify
  const handleVerify = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (authMode === 'register') {
        setStep('pincode')
      } else {
        // Sign-in: determine if value is email or mobile
        const isEmail = signinValue.includes('@')
        const userData = {
          name: '',
          email: isEmail ? signinValue : '',
          mobile: isEmail ? '' : signinValue,
        }
        login(userData)
        sessionStorage.setItem('farmdirect-seen-welcome', 'true')
        setIsOpen(false)
        window.location.reload()
      }
    }, 1200)
  }

  const handlePincodeSubmit = async (e) => {
    e.preventDefault()
    if (tempPincode.length !== 6) return
    setLoading(true)
    await updatePincode(tempPincode)
    setLoading(false)
    finishAuth()
  }

  const finishAuth = () => {
    const userData = { name, email, mobile }
    login(userData)
    sessionStorage.setItem('farmdirect-seen-welcome', 'true')
    setIsOpen(false)
    window.location.reload()
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
    
    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`)
      nextInput?.focus()
    }
  }

  // Detect if signinValue is email or phone for display
  const isSigninEmail = signinValue.includes('@')

  // Step titles & subtitles
  const getTitle = () => {
    switch (step) {
      case 'choice': return t('welcomeToFarmDirect', 'Welcome to FarmDirect')
      case 'register': return t('createAccount', 'Create Your Account')
      case 'signin': return t('welcomeBack', 'Welcome Back')
      case 'otp': return t('verifyIdentity', 'Verify Identity')
      case 'pincode': return t('setDeliveryLocation', 'Set Delivery Location')
      default: return ''
    }
  }

  const getSubtitle = () => {
    switch (step) {
      case 'choice': return t('chooseOption', 'Join our community or sign in to continue.')
      case 'register': return t('registerSubtitle', 'Fill in your details to get started.')
      case 'signin': return t('signinSubtitle', 'Enter your mobile number or email to continue.')
      case 'otp': return t('otpSubtitle', 'Enter the 6-digit code sent to your mobile.')
      case 'pincode': return t('pincodeSubtitle', 'Enter your pincode to check availability.')
      default: return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          {/* Header — shared across all steps */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-xl shadow-emerald-600/20">
              <Leaf size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {getTitle()}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {getSubtitle()}
            </p>
          </div>

          {/* ─── STEP: CHOICE ─── */}
          {step === 'choice' && (
            <div className="space-y-4">
              {/* Register option */}
              <button
                onClick={() => setStep('register')}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-colors">
                  <UserPlus size={22} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{t('registerNow', 'Register')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('registerDesc', 'Create a new account to get started')}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </button>

              {/* Sign In option */}
              <button
                onClick={() => setStep('signin')}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 transition-colors">
                  <LogIn size={22} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{t('signInExisting', 'Sign In')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('signInDesc', 'Already have an account? Sign in here')}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </button>

              {/* Skip */}
              <button 
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm mt-2"
              >
                {t('skipForNow', 'Skip for Now')}
              </button>
            </div>
          )}

          {/* ─── STEP: REGISTER ─── */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{t('fullName', 'Full Name')}</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('enterName', 'Enter your name')}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{t('emailAddress', 'Email Address')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder={t('enterEmail', 'Enter your email')}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{t('mobileNumber', 'Mobile Number')}</label>
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
                      {t('registerNow', 'Register')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => { setStep('choice'); setOtp(['', '', '', '', '', '']) }}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  {t('goBack', '← Back')}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP: SIGN IN ─── */}
          {step === 'signin' && (
            <form onSubmit={handleSigninSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{t('mobileOrEmail', 'Mobile Number or Email')}</label>
                <div className="relative">
                  {isSigninEmail 
                    ? <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    : <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  }
                  <input 
                    required
                    type="text" 
                    value={signinValue}
                    onChange={(e) => setSigninValue(e.target.value.trim())}
                    placeholder={t('signinPlaceholder', 'Enter mobile number or email')}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  disabled={loading || !signinValue}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      {t('sendOtp', 'Send OTP')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => { setStep('choice'); setOtp(['', '', '', '', '', '']) }}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  {t('goBack', '← Back')}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP: OTP ─── */}
          {step === 'otp' && (
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
                      {t('verifyAndAccess', 'Verify & Access')}
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => { 
                    setStep(authMode === 'register' ? 'register' : 'signin')
                    setOtp(['', '', '', '', '', ''])
                  }}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  {t('goBack', '← Back')}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP: PINCODE (register only) ─── */}
          {step === 'pincode' && (
            <form onSubmit={handlePincodeSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{t('pincode', 'Pincode')}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    maxLength={6}
                    value={tempPincode}
                    onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('enterPincodePlaceholder', 'Enter 6-digit pincode')}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  disabled={loading || tempPincode.length !== 6}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      {t('completeSetup', 'Complete Setup')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={finishAuth}
                  className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  {t('skipLocation', 'Skip Location')}
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500 px-6">
            {t('termsAndPrivacy', 'By continuing, you agree to our Terms of Service and Privacy Policy. Your data is protected by farm-grade security.')}
          </p>
        </div>
      </div>
    </div>
  )
}
