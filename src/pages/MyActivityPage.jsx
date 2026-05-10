import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, Heart, Cloud, HandHeart, Activity, ArrowRight, Trash2 } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

export default function MyActivityPage() {
  const navigate = useNavigate()
  const { user, wishlist, toggleWishlist } = useUser()
  const { t } = useTranslation()

  if (!user) return null

  const activityCards = [
    {
      id: 'reviews',
      titleKey: 'yourReviews',
      descKey: 'yourReviewsDesc',
      icon: Star,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      path: '/profile/reviews',
      value: t('reviewsCount', { count: 12 })
    },
    {
      id: 'wishlist',
      titleKey: 'myWishlist',
      descKey: 'myWishlistDesc',
      icon: Heart,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      path: '/profile/wishlist',
      value: t('wishlistItems', { count: wishlist.length })
    }
  ]

  const impactMetrics = [
    {
      labelKey: 'emissionSaved',
      value: '12.5 kg',
      icon: Cloud,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      descKey: 'emissionSavedDesc'
    },
    {
      labelKey: 'farmersHelped',
      value: t('farmersHelpedValue', { count: 8 }),
      icon: HandHeart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      descKey: 'farmersHelpedDesc'
    }
  ]

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} />
              {t('backToAccount')}
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Activity className="text-emerald-600" size={32} />
              {t('myActivityAndImpact')}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{t('trackContributions')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Main Activity Sections */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 pl-1">{t('recentActivity')}</h2>
            {activityCards.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.id}
                  onClick={() => navigate(card.path)}
                  className="w-full flex items-center gap-5 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group text-left shadow-sm hover:shadow-md"
                >
                  <div className={`h-16 w-16 rounded-3xl ${card.bgColor} ${card.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} fill={card.id === 'reviews' || card.id === 'wishlist' ? 'currentColor' : 'none'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{t(card.titleKey)}</h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                        {card.value}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{t(card.descKey)}</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>
              )
            })}
          </div>

          {/* Impact Stats */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 pl-1">{t('yourGreenImpact')}</h2>
            <div className="grid grid-cols-1 gap-4">
              {impactMetrics.map((metric, idx) => {
                const Icon = metric.icon
                return (
                  <div 
                    key={idx}
                    className={`p-8 rounded-[2.5rem] ${metric.bgColor} border border-white/20 dark:border-white/5 flex flex-col items-center text-center`}
                  >
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4">
                      <Icon className={metric.color} size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t(metric.labelKey)}</span>
                    <p className={`text-4xl font-black ${metric.color} mt-2 tracking-tight`}>{metric.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 leading-relaxed max-w-[200px]">
                      {t(metric.descKey)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>


        {/* Bottom Banner */}
        <div className="mt-12 p-8 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-2xl font-bold mb-2">{t('keepHarvestingGoodness')}</h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed mb-6">
              {t('keepHarvestingDesc')}
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10"
            >
              {t('shopNewHarvests')}
            </button>
          </div>
          <Activity className="absolute -right-8 -bottom-8 text-white/10 w-64 h-64 rotate-12" />
        </div>

      </div>
    </div>
  )
}
