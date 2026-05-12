import { MapPin, Phone, Sprout, Tractor, Award, Leaf, Home, Check, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
const defaultFarmers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Pune, Maharashtra',
    distance: '2.5 km',
    specialization: ['Organic Wheat', 'Millet'],
    experience: 15,
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=500&q=80',
    badgeKey: 'certifiedOrganic',
    bioKey: 'farmerBioRajesh'
  },
  {
    id: '2',
    name: 'Sunita Devi',
    location: 'Satara, Maharashtra',
    distance: '4.8 km',
    specialization: ['Turmeric', 'Ginger'],
    experience: 12,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80',
    badgeKey: 'ecoFarmer',
    bioKey: 'farmerBioRajesh'
  },
  {
    id: '3',
    name: 'Amit Singh',
    location: 'Nashik, Maharashtra',
    distance: '6.2 km',
    specialization: ['Grapes', 'Onions'],
    experience: 8,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=500&q=80',
    badgeKey: 'topSeller',
    bioKey: 'farmerBioRajesh'
  }
];

const badgeColors = {
  'certifiedOrganic': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'topSeller': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'veteranFarmer': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'premiumQuality': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'milletPioneer': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'ecoFarmer': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

export default function FarmersPage() {
  const { locationInfo, user } = useUser()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all') // 'all' or 'local'
  const [farmers, setFarmers] = useState(defaultFarmers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [followedFarmers, setFollowedFarmers] = useState([])

  useEffect(() => {
    const fetchFarmers = async (isInitial = true) => {
      try {
        if (isInitial) setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";

        let url = `${apiUrl}/api/farmers`;
        if (filter === 'local') {
          const targetState = user?.state || locationInfo?.state;
          const targetPincode = user?.pincode || locationInfo?.pincode;

          const params = new URLSearchParams();
          if (targetState) params.append('state', targetState);
          if (targetPincode) params.append('pincode', targetPincode);

          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }

        let res = await fetch(url);
        let data = await res.json();
        let fetchedFarmers = Array.isArray(data?.farmers) ? data.farmers : [];

        const mappedFarmers = fetchedFarmers.map((dbFarmer, i) => ({
          id: dbFarmer._id,
          name: dbFarmer.name || <span className="text-[10px] text-slate-400 italic">missing</span>,
          location: [dbFarmer.city || dbFarmer.villageLocality, dbFarmer.state].filter(Boolean).join(', ') || 'Local',
          distance: dbFarmer.pincode === (user?.pincode || locationInfo?.pincode) ? 'Very Close' : 'Nearby',
          specialization: Array.isArray(dbFarmer.crops) && dbFarmer.crops.length ? dbFarmer.crops : ['Organic Produce'],
          experience: dbFarmer.experience || 5,
          image: dbFarmer.profilePhoto || dbFarmer.image || '',
          badgeKey: dbFarmer.isVerified ? 'certifiedOrganic' : 'ecoFarmer',
          bioKey: dbFarmer.bio || 'farmerBioRajesh',
          isVerified: dbFarmer.isVerified
        }));
        setFarmers(mappedFarmers);
        setError(null)
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError("Cannot reach server. Please check your connection.")
      } finally {
        if (isInitial) setLoading(false)
      }
    };

    fetchFarmers(true);

    const interval = setInterval(() => fetchFarmers(false), 30000);
    return () => clearInterval(interval);
  }, [user?.state, user?.pincode, locationInfo, filter]);

  let displayLocation = '';
  if (user && user.city && user.state) {
    displayLocation = `${user.city}, ${user.state}`;
  } else if (locationInfo) {
    displayLocation = `${locationInfo.district}, ${locationInfo.state}`;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <Tractor size={28} className="text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">
          {user ? t('farmersNearYou') : t('allFarmers')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-black dark:text-slate-300 sm:text-lg">
          {user ? t('farmersNearYouDesc') : t('allFarmersDesc')}
        </p>

        {/* Location indicator */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          <MapPin size={13} />
          {user ? t('showingFarmersNear', { location: displayLocation }) : t('showingAllFarmers')}
        </div>

        {/* Filter Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 shadow-inner">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              {t('allFarmersFilter')}
            </button>
            <button
              onClick={() => setFilter('local')}
              className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${filter === 'local'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              {t(user?.state || locationInfo?.state || 'myState')}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            {error}
          </div>
        )}
      </div>

      {/* Farmer Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[400px] rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))
        ) : (
          farmers.map((farmer, index) => (
            <div
              key={farmer.id || farmer.name + index}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="p-1">
                {/* Profile row */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={farmer.image || ''}
                      alt={farmer.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-700"
                    />
                    {/* Verification Badge */}
                    {farmer.isVerified && (
                      <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg animate-in zoom-in-50">
                        <Check size={14} className="text-white" strokeWidth={4} />
                      </div>
                    )}
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
                  <Link
                    to={`/products?farmerId=${farmer.id}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98]"
                  >
                    <Leaf size={14} />
                    {t('viewProducts')}
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      to={`/farm-profile/${encodeURIComponent(farmer.name)}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                    >
                      <Home size={14} />
                      {t('farmProfile')}
                    </Link>
                    <button
                      onClick={() => {
                        setFollowedFarmers(prev =>
                          prev.includes(farmer.id) ? prev.filter(id => id !== farmer.id) : [...prev, farmer.id]
                        )
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${followedFarmers.includes(farmer.id)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                    >
                      <UserPlus size={14} />
                      {followedFarmers.includes(farmer.id) ? t('followed', 'Followed') : t('follow', 'Follow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center dark:from-slate-800 dark:to-slate-700">
        <h2 className="text-xl font-bold text-white sm:text-2xl">{t('areYouFarmer')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          {t('areYouFarmerDesc')}
        </p>
        <button 
          onClick={() => window.location.href = "https://hackathonwebapp.vercel.app"}
          className="mt-5 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
        >
          {t('registerAsFarmer')}
        </button>
      </div>
    </section>
  )
}
