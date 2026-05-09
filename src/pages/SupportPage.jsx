import { MessageSquare, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SupportPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const options = [
    {
      icon: MessageSquare,
      titleKey: 'talkToAdmin',
      descKey: 'talkToAdminDesc',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      action: () => alert('Connecting to Admin...') // Placeholder
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
            return (
              <button
                key={idx}
                onClick={option.action}
                className="flex flex-col items-start p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all group text-left"
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
      </div>
    </div>
  )
}
