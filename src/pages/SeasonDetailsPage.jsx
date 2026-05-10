import { useMemo, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { seasons } from '../data/seasons'
import { products } from '../data/products'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SeasonDetailsPage() {
  const { seasonId } = useParams()
  const { addItem } = useCart()
  const { addToRecentlyViewed } = useUser()
  const { t } = useTranslation()
  const [activeProduct, setActiveProduct] = useState(null)

  const season = seasons.find(s => s.id === seasonId)

  const seasonProducts = useMemo(() => {
    if (!season) return []
    // Match against the database value (e.g. 'Summer', 'Winter')
    return products.filter(p => p.season === season.dbValue)
  }, [season])

  if (!season) {
    return <Navigate to="/seasons" replace />
  }

  const Icon = season.icon

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen transition-colors pb-16">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] min-h-[300px]">
        <div className="absolute inset-0">
          <img 
            src={season.image} 
            alt={t(season.nameKey)} 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${season.color} mix-blend-multiply opacity-60`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Link to="/seasons" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors w-fit">
            <ChevronLeft size={16} className="mr-1" />
            {t('backToSeasons')}
          </Link>
          
          <div className="flex items-center gap-4 text-white/90 mb-3">
            <Icon size={32} />
            <span className="text-lg font-bold uppercase tracking-widest">{t('harvestCollection')}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t(season.nameKey)}
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl">
            {t(season.descKey)} {t('exploreFinestSeasonal')}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('availableProduce', { season: season.dbValue })}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t('showing')} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{seasonProducts.length}</span> {t('items')}
          </p>
        </div>

        {seasonProducts.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {seasonProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
                onViewDetails={(p) => {
                  setActiveProduct(p)
                  addToRecentlyViewed(p)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-emerald-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-6 py-16 text-center transition-colors">
            <Icon size={48} className="mx-auto text-emerald-600/50 dark:text-emerald-500/50 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('harvestingSoon')}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              {t('harvestingSoonDesc')}
            </p>
          </div>
        )}
      </div>

      <ProductModal
        key={activeProduct?.id ?? 'empty'}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addItem}
      />
    </div>
  )
}
