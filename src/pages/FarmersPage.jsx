import { MapPin, Phone, Sprout, Tractor, Award, Leaf, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

const farmers = [
  {
    name: 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    distance: '4.2 km',
    specialization: ['Organic Vegetables', 'Tomatoes', 'Spinach'],
    experience: 12,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=300&fit=crop&crop=face',
    badgeKey: 'certifiedOrganic',
    bioKey: 'farmerBioRajesh',
  },
  {
    name: 'Anita Devi',
    location: 'Pune, Maharashtra',
    distance: '6.8 km',
    specialization: ['Fruits', 'Alphonso Mangoes', 'Guava'],
    experience: 8,
    image: 'https://images.unsplash.com/photo-1592878897400-47261f483216?w=300&h=300&fit=crop&crop=face',
    badgeKey: 'topSeller',
    bioKey: 'farmerBioAnita',
  },
  {
    name: 'Suresh Patil',
    location: 'Sangli, Maharashtra',
    distance: '11.5 km',
    specialization: ['Sugarcane', 'Jaggery', 'Commercial Crops'],
    experience: 20,
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face',
    badgeKey: 'veteranFarmer',
    bioKey: 'farmerBioSuresh',
  },

  {
    name: 'Vikram Singh',
    location: 'Ahmednagar, Maharashtra',
    distance: '14.3 km',
    specialization: ['Grains', 'Basmati Rice', 'Organic Millets'],
    experience: 18,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    badgeKey: 'milletPioneer',
    bioKey: 'farmerBioVikram',
  },
  {
    name: 'Lakshmi Bai',
    location: 'Satara, Maharashtra',
    distance: '9.7 km',
    specialization: ['Cotton', 'Jute', 'Natural Fibers'],
    experience: 10,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    badgeKey: 'ecoFarmer',
    bioKey: 'farmerBioLakshmi',
  },
]

const badgeColors = {
  'certifiedOrganic': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'topSeller': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'veteranFarmer': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'premiumQuality': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'milletPioneer': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'ecoFarmer': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

export default function FarmersPage() {
  const { locationInfo } = useUser()
  const { t } = useTranslation()
  const displayLocation = locationInfo ? `${locationInfo.district}, ${locationInfo.state}` : 'Pune, Maharashtra'
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <Tractor size={28} className="text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {t('farmersNearYou')}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          {t('farmersNearYouDesc')}
        </p>

        {/* Location indicator */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          <MapPin size={13} />
          {t('showingFarmersNear', { location: displayLocation })}
        </div>
      </div>

      {/* Farmer Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farmers.map((farmer) => (
          <div
            key={farmer.name}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-slate-700/50 dark:bg-slate-800/80"
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="p-6">
              {/* Profile row */}
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-700"
                  />
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {farmer.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={12} />
                    {farmer.location}
                    <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {farmer.distance}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColors[farmer.badgeKey] || 'bg-slate-100 text-slate-600'}`}>
                      <Award size={10} />
                      {t(farmer.badgeKey)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      <Tractor size={10} />
                      {farmer.experience} {t('years')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {t(farmer.bioKey)}
              </p>

              {/* Specializations */}
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Sprout size={12} />
                  {t('specialization')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {farmer.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 space-y-2">
                <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98]">
                  <Leaf size={14} />
                  {t('viewProducts')}
                </button>
                <div className="flex gap-2">
                  <Link 
                    to={`/farm-profile/${encodeURIComponent(farmer.name)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                  >
                    <Home size={14} />
                    {t('farmProfile')}
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400">
                    <Phone size={14} />
                    {t('contact')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center dark:from-slate-800 dark:to-slate-700">
        <h2 className="text-xl font-bold text-white sm:text-2xl">{t('areYouFarmer')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          {t('areYouFarmerDesc')}
        </p>
        <button className="mt-5 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]">
          {t('registerAsFarmer')}
        </button>
      </div>
    </section>
  )
}
