import { useEffect, useMemo, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { seasons } from '../data/seasons'
import { products } from '../data/products'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { ChevronLeft, Loader2, Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SeasonDetailsPage() {
  const { seasonId } = useParams()
  const { addItem } = useCart()
  const { addToRecentlyViewed } = useUser()
  const { t } = useTranslation()
  const [activeProduct, setActiveProduct] = useState(null)
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();
        setDbProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch seasonal products:", err);
      } finally {
        setLoading(false)
      }
    };
    fetchProducts();
  }, []);

  const season = seasons.find(s => s.id === seasonId)

  const seasonProducts = useMemo(() => {
    if (!season) return []
    // Combine mock products and DB products
    const all = [...dbProducts, ...products]
    return all.filter(p => p.season === season.dbValue)
  }, [season, dbProducts])

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
            {t('availableProduce', { season: t(season.nameKey) })}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t('showing')} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{seasonProducts.length}</span> {t('items')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
            <p className="mt-4 text-slate-500 font-medium">Loading {t(season.nameKey)} collection...</p>
          </div>
        ) : seasonProducts.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {seasonProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={{
                  ...product,
                  id: product._id || product.id,
                  name: product.title || product.name || 'Untitled',
                  farm_name: product.owner?.name || product.farm_name || 'missing'
                }}
                onAddToCart={addItem}
                onViewDetails={(p) => {
                  setActiveProduct(p)
                  addToRecentlyViewed(p)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-6 py-24 text-center transition-colors">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Leaf size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('harvestingSoon')}</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">
              We're currently working with our farmers to bring fresh {t(season.nameKey)} produce to your doorstep.
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
