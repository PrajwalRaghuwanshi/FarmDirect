import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { seasons } from '../data/seasons'
import { useTranslation } from 'react-i18next'

export default function SeasonsPage() {
  const { t } = useTranslation()

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-[calc(100vh-80px)] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
            {t('seasonsBestTitle')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('seasonsBestDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {seasons.map((season) => {
            const Icon = season.icon
            return (
              <Link
                key={season.id}
                to={`/seasons/${season.id}`}
                className="group relative overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 h-80 flex flex-col"
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={season.image}
                    alt={t(season.nameKey)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${season.color} mix-blend-multiply opacity-40 group-hover:opacity-50 transition-opacity`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative flex-1 p-8 flex flex-col justify-end z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 text-white/90">
                        <Icon size={24} />
                        <span className="text-sm font-bold uppercase tracking-wider">{t('harvest')}</span>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-2">{t(season.nameKey)}</h2>
                      <p className="text-slate-200 text-sm max-w-sm">{t(season.descKey)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform group-hover:translate-x-2 transition-transform">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
