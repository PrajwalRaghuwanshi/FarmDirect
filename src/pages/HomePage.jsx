import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import ProductModal from '../components/ProductModal'
import ProductCard from '../components/ProductCard'
import { products as mockProducts } from '../data/products'
import { Heart, Play, Users, ShieldCheck, Truck, Check, ChevronRight, Leaf, History, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80', position: 'object-right-top' },
  { src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', position: 'object-center' }
]

const RTL_LANGUAGES = ['ur', 'sd', 'ks'];

export default function HomePage() {
  const { addItem } = useCart()
  const { user, addToRecentlyViewed, nearbyProducts, locationInfo, loadingLocal } = useUser()
  const { t, i18n } = useTranslation()
  const isRTL = RTL_LANGUAGES.includes(i18n.language)
  const [activeProduct, setActiveProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProducts([]); // Clear current products to "ask" for fresh data
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
        
        // Prioritize getting ALL products first to ensure something is always shown
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();
        const allProducts = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (data.products ? [data.products] : []));

        const normalizeId = (id) => (id && typeof id === 'object' && id.$oid) ? id.$oid : id;
        const targetState = user?.state;
        
        let filteredProducts = allProducts;
        if (user && targetState) {
          filteredProducts = allProducts.filter(p => {
            const stateMatch = p.state?.toLowerCase() === targetState.toLowerCase() ||
                             p.owner?.state?.toLowerCase() === targetState.toLowerCase();
            return stateMatch;
          });
        }

        // Strictly require 'owner' key for existence check
        const finalizedProducts = (user && targetState) 
          ? filteredProducts.filter(p => p.owner || p.ownerId) 
          : allProducts.filter(p => p.owner || p.ownerId);
        
        const mappedProducts = finalizedProducts
          .filter(p => Number(p.price) > 0) // Filter out invalid/test products
          .map(p => ({
            ...p,
            id: normalizeId(p._id),
            name: p.title || p.name || 'Untitled Product',
            image: (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : (p.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80'),
            farm_name: p.owner?.name || p.farm_name || 'missing',
            unit: p.unit || 'kg',
            stock_level: p.stock || p.stock_level || 0,
            category: p.category || 'General'
          }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Error fetching products, falling back to local data:", err);
        const mappedMock = mockProducts.map(p => ({
          ...p,
          id: p.id || p._id,
          name: p.title || p.name || 'Untitled Product',
          image: (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : (p.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80'),
          farm_name: p.owner?.name || p.farm_name || 'missing',
          unit: p.unit || 'kg',
          stock_level: p.stock || p.stock_level || 0,
          category: p.category || 'General'
        }));
        setProducts(mappedMock);
      }
    };

    fetchProducts();

    // 🔄 REAL-TIME POLLING: Refresh products every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, [user?.state, locationInfo?.state]);

  return (
    <div className="transition-colors">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-50 min-h-[500px] py-12 flex items-center shadow-sm">
          {/* Background Image Slideshow */}
          <div className="absolute inset-0 w-full h-full bg-emerald-900">
            {heroImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={`Farm landscape ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover ${image.position} transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            ))}
            {/* Gradient overlay to make text readable — flips for RTL — Minimized for maximum image visibility */}
            <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white/60 to-transparent w-full md:w-1/3 z-0`}></div>
          </div>

          {/* Content */}
          <div className={`relative z-10 w-full md:w-1/2 p-8 lg:p-16 lg:pb-24 flex flex-col items-center text-center backdrop-blur-[2px] md:backdrop-blur-0 ${isRTL ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-2 text-sm font-semibold text-emerald-800 backdrop-blur-sm">
              <Leaf size={16} className="text-emerald-600" />
              {t('freshLocalSustainable')}
            </div>

            <h1 className="mt-6 text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:leading-[1.1]">
              {t('heroTitle1')} <br />
              {t('heroTitle2')} <span className="text-emerald-600">{t('heroTitle3')}</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-slate-600">
              {t('heroDesc')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:scale-105"
              >
                {t('shopNow')}
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 backdrop-blur-sm transition hover:bg-white hover:border-slate-300">
                <Play size={16} className="text-emerald-600 fill-emerald-600" />
                {t('howItWorks')}
              </Link>
            </div>
          </div>

          {/* Floating Know Your Farmer Card */}
          <div className={`absolute top-1/4 hidden lg:block rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-md w-72 ${isRTL ? 'left-8' : 'right-8'}`}>
            <h3 className="text-lg font-bold text-slate-900">{t('knowYourFarmer')}</h3>
            <p className="mt-1 text-sm text-slate-500">{t('seeWhoGrows')}</p>

            <Link to="/farmers" className="mt-4 flex w-fit items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition">
              {t('meetOurFarmers')} <ChevronRight size={16} className={isRTL ? 'mr-1 rotate-180' : 'ml-1'} />
            </Link>

            <div className="mt-4 flex items-center gap-[-8px]">
              {['1', '2', '3', '4'].map((i) => (
                <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden ${i !== '1' ? (isRTL ? '-mr-2' : '-ml-2') : ''}`}>
                  <img src={`https://i.pravatar.cc/100?img=${parseInt(i) + 10}`} alt="Farmer" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className={`${isRTL ? '-mr-2' : '-ml-2'} flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-bold text-emerald-700`}>
                +25
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        <div className="rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 shadow-sm border border-slate-100/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
          {[
            { icon: Users, titleKey: 'directFromFarmers', descKey: 'noMiddlemen' },
            { icon: Leaf, titleKey: 'freshAndHealthy', descKey: 'naturallyGrown' },
            { icon: ShieldCheck, titleKey: 'safeAndTrusted', descKey: 'qualityYouCanTrust' },
            { icon: Truck, titleKey: 'fastDelivery', descKey: 'toYourDoorstep' },
          ].map((feature, idx, arr) => {
            const Icon = feature.icon;
            return (
              <div key={feature.titleKey} className={`flex flex-1 items-center gap-4 px-4 ${idx !== arr.length - 1 ? 'border-r border-slate-100' : ''}`}>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t(feature.titleKey)}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t(feature.descKey)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>


      {/* Local Discovery Section */}
      {(nearbyProducts.length > 0 || loadingLocal) && (
        <section className="mx-auto max-w-7xl px-4 pb-16 mt-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('nearbyLocalFarmers')}</h2>
              {locationInfo && (
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">
                  {t('freshFrom')} {locationInfo.district}, {locationInfo.state}
                </p>
              )}
            </div>
          </div>

          {loadingLocal ? (
            <div className="mt-8 flex justify-center py-12">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {nearbyProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addItem}
                  onViewDetails={(p) => {
                    setActiveProduct(p)
                    addToRecentlyViewed(p)
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Fresh Picks */}
      <section className="mx-auto max-w-7xl px-4 pb-16 mt-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('freshPicks', 'Fresh Picks')}
            </h2>
            {user && user.state && (
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">
                {t('freshFrom')} {user.city || user.state}
              </p>
            )}
          </div>
          <Link to="/products" className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            {t('viewAllProductsLink')} <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="mt-6">
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product) => (
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Leaf className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('sorryNoProducts', 'Sorry, we couldn\'t find any products right now.')}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {t('checkBackLater', 'Please check back later or try a different location.')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Strip */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {[
              { icon: Users, titleKey: 'supportLocalFarmers', descKey: 'empowerFarmingCommunities' },
              { icon: Leaf, titleKey: 'sustainableLiving', descKey: 'ecoFriendlyAndEthical' },
              { icon: ShieldCheck, titleKey: 'fairPrices', descKey: 'betterForYouAndFarmers' },
              { icon: Check, titleKey: 'hundredSatisfaction', descKey: 'qualityGuaranteed' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.titleKey} className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t(item.titleKey)}</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(item.descKey)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ProductModal
        key={activeProduct?.id ?? 'empty'}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addItem}
      />
    </div>
  )
}
