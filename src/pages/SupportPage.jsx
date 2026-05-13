import { MessageSquare, AlertTriangle, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useUser } from '../context/UserContext'

export default function SupportPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useUser()

  const [showAdminInput, setShowAdminInput] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSendTicket = async () => {
    if (!user) {
      setError('Please sign in to send a message')
      return
    }
    if (!adminMessage.trim()) return

    setSending(true)
    setError('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
      const res = await fetch(`${apiUrl}/api/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          message: adminMessage
        })
      })

      if (res.ok) {
        setSuccess(true)
        setAdminMessage('')
        setTimeout(() => {
          setSuccess(false)
          setShowAdminInput(false)
        }, 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const options = [
    {
      icon: MessageSquare,
      titleKey: 'talkToAdmin',
      descKey: 'talkToAdminDesc',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      action: () => setShowAdminInput(!showAdminInput)
    },
    {
      icon: AlertTriangle,
      titleKey: 'reportFarmer',
      descKey: 'reportFarmerDesc',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      action: () => alert('Opening report form...') // Placeholder
    }
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t('goBack')}
        </button>

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
            {t('customerService')}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('howCanWeHelp')}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {options.map((option, idx) => {
            const Icon = option.icon
            const isSelected = option.titleKey === 'talkToAdmin' && showAdminInput
            return (
              <button
                key={idx}
                onClick={option.action}
                className={`flex flex-col items-start p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm border transition-all group text-left ${
                  isSelected ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-xl' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${option.color}`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t(option.titleKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {t(option.descKey)}
                </p>
              </button>
            )
          })}
        </div>

        {/* Support Input Section */}
        {showAdminInput && (
          <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden relative">
              {success && (
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in duration-300">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center gap-3">
                    <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" />
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Message Sent!</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <MessageSquare size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Describe your issue</h2>
              </div>

              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="How can we help you today? Please provide as much detail as possible..."
                className="w-full h-40 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
              />

              {error && <p className="mt-3 text-sm font-bold text-rose-500 px-2">{error}</p>}

              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-slate-400 max-w-[250px]">
                  An admin will get back to you shortly via your registered email/mobile.
                </p>
                <button
                  disabled={sending || !adminMessage.trim()}
                  onClick={handleSendTicket}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {sending ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
