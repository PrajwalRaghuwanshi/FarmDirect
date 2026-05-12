import { useEffect, useMemo, useState } from 'react'
import { MapPin, Carrot, Apple, Wheat, Tractor, Flame, Sprout, Leaf, LayoutGrid, Recycle, ShieldCheck, Filter, Check, ChevronDown, X, AlertCircle, Award, Cherry, Shrub, Factory } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import { products } from '../data/products'
import { useTranslation } from 'react-i18next'

const categories = [
  { id: 'All', key: 'allItems' },
  { id: 'Vegetables', key: 'vegetables' },
  { id: 'Fruits', key: 'fruits' },
  { id: 'Grains & Pulses', key: 'grainsPulses' },
  { id: 'Commercial Crops', key: 'commercialCrops' },
  { id: 'Spices', key: 'spices' },
  { id: 'Fibers', key: 'fibers' },
  { id: 'Seeds & Nuts', key: 'seedsNuts' },
  { id: 'Primary Processed', key: 'primaryProcessed' }
]

const categoryIcons = {
  'All': LayoutGrid,
  'Vegetables': Carrot,
  'Fruits': Apple,
  'Grains & Pulses': Wheat,
  'Organic': Leaf,
  'Commercial Crops': Tractor,
  'Spices': Flame,
  'Fibers': Sprout,
  'Seeds & Nuts': Wheat,
  'Primary Processed': Factory
}

const valueFilters = [
  { id: 'organicFarming', key: 'organicFarming', icon: Leaf },
  { id: 'chemicalFree', key: 'chemicalFree', icon: ShieldCheck },
  { id: 'freshHarvest', key: 'freshHarvest', icon: Shrub },
  { id: 'lowStock', key: 'lowStock', icon: AlertCircle },
  { id: 'bestSelling', key: 'bestSelling', icon: Award },
]
export default function ProductsPage() {
  const { addItem } = useCart()
  const { addToRecentlyViewed, pincode, locationInfo, user } = useUser()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const farmerIdFilter = searchParams.get('farmerId')
  const [selectedFarmerName, setSelectedFarmerName] = useState('')

  const [activeProduct, setActiveProduct] = useState(null)
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedValues, setSelectedValues] = useState([])
  const [openSections, setOpenSections] = useState(['Categories', 'Values'])
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [error, setError] = useState(null)

  // Read filters from URL
  const categoryParam = searchParams.get('category')
  const selectedCategories = categoryParam ? categoryParam.split(',') : ['All']
  const selectedSeason = searchParams.get('season') || 'All'
  const selectedFarmerId = searchParams.get('farmerId')

  const toggleSection = (section) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  useEffect(() => {
    const fetchProducts = async (isInitial = true) => {
      try {
        if (isInitial) {
          setLoading(true);
          setDbProducts([]); // Clear current products to force a fresh "ask"
        }
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
        const res = await fetch(`${apiUrl}/api/products`);
        const data = await res.json();

        const normalizeId = (id) => (id && typeof id === 'object' && id.$oid) ? id.$oid : id;
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);

        if (productsArray.length > 0) {
          let filtered = productsArray;
          if (farmerIdFilter) {
            filtered = productsArray.filter(p => {
              const ownerId = normalizeId(p.owner?._id || p.owner);
              return ownerId === farmerIdFilter;
            });
            // Get farmer name from first matching product
            if (filtered.length > 0) {
              setSelectedFarmerName(filtered[0].owner?.name || 'missing');
            }
          }
          setDbProducts(filtered.map(p => ({ ...p, _id: normalizeId(p._id), id: normalizeId(p._id) })));
        } else {
          setDbProducts([]);
        }
        setError(null)
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Cannot reach server. Please check your connection.")
        setDbProducts(products); // Fallback to mock data
      } finally {
        if (isInitial) setLoading(false)
      }
    };

    fetchProducts(true);

    // 🔄 REAL-TIME POLLING: Refresh product list every 30 seconds
    const interval = setInterval(() => fetchProducts(false), 30000);
    return () => clearInterval(interval);
  }, [searchParams, user?.state, locationInfo?.state]);

  function handleCategorySelect(categoryId) {
    const newParams = new URLSearchParams(searchParams)
    let current = [...selectedCategories]

    if (categoryId === 'All') {
      newParams.delete('category')
    } else {
      // Remove 'All' if it's there
      current = current.filter(c => c !== 'All')

      if (current.includes(categoryId)) {
        current = current.filter(c => c !== categoryId)
      } else {
        current.push(categoryId)
      }

      if (current.length === 0) {
        newParams.delete('category')
      } else {
        newParams.set('category', current.join(','))
      }
    }
    setSearchParams(newParams)
  }

  const filteredProducts = useMemo(() => {
    return dbProducts.filter((product) => {
      const matchesCategory =
        selectedCategories.includes('All') || selectedCategories.includes(product.category)
      const matchesSeason =
        selectedSeason === 'All' || product.season === selectedSeason
      const matchesFarmer =
        !farmerIdFilter || 
        product.owner?._id === farmerIdFilter || product.owner === farmerIdFilter ||
        product.farmer?._id === farmerIdFilter || product.farmer === farmerIdFilter

      // Simple mock for value filters: just check if 'organic' etc is in the name or tags if available
      // In a real app, this would check product.attributes or product.values
      // Specific logic for value filters
      const matchesValues = selectedValues.length === 0 || selectedValues.every(val => {
        if (val === 'lowStock') return product.stock_level > 0 && product.stock_level < 15;
        if (val === 'bestSelling') return product.rating >= 4.8 || product.badge === 'Best Seller';
        
        // Generic check for others (Organic farming, Chemical free, Fresh harvest)
        const str = JSON.stringify(product).toLowerCase()
        const searchTerms = {
          'organicFarming': ['organic', 'pesticide-free', 'natural'],
          'chemicalFree': ['chemical', 'non-toxic', 'pesticide-free'],
          'freshHarvest': ['fresh', 'harvest', 'new']
        }
        const terms = searchTerms[val] || [val.toLowerCase()];
        return terms.some(term => str.includes(term));
      })

      return matchesCategory && matchesSeason && matchesFarmer && matchesValues
    })
  }, [dbProducts, selectedCategories, selectedSeason, farmerIdFilter, selectedValues])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              {selectedSeason !== 'All' ? `${selectedSeason} ${t('harvest')}` : t('productGallery')}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('shopByFreshness')}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              {t('exploreProducts')}
            </p>
          </div>

          {pincode && (
            <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 self-start lg:self-end">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('deliveringTo')}</p>
                <div className="flex flex-col mt-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {user?.pincode || pincode}
                  </p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
                    {user?.city || locationInfo?.district || '...'}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {user?.state || locationInfo?.state || '...'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar and Main Content Wrapper */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
              
              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="w-full lg:hidden flex items-center justify-between mb-0"
              >
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('filters')}</h2>
                </div>
                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${showFiltersMobile ? 'rotate-180' : ''}`} />
              </button>

              <div className={`mt-6 lg:block ${showFiltersMobile ? 'block animate-in fade-in slide-in-from-top-2' : 'hidden'}`}>
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('filters')}</h2>
                  </div>

                {farmerIdFilter && selectedFarmerName && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] font-bold animate-in zoom-in-95">
                    <span className="truncate max-w-[80px]">{selectedFarmerName}</span>
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('farmerId');
                        setSearchParams(newParams);
                        setSelectedFarmerName('');
                      }}
                      className="hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('Categories')}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 hover:text-emerald-600 transition-colors"
                >
                  <span>{t('categories')}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.includes('Categories') ? '' : '-rotate-90'}`} />
                </button>

                {openSections.includes('Categories') && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {categories.map(cat => {
                      const Icon = categoryIcons[cat.id] || LayoutGrid
                      const isActive = selectedCategories.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                            {t(cat.key)}
                          </div>
                          {isActive && cat.id !== 'All' && <Check size={14} className="text-emerald-600" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Values */}
              <div>
                <button
                  onClick={() => toggleSection('Values')}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 hover:text-emerald-600 transition-colors"
                >
                  <span>{t('values')}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${openSections.includes('Values') ? '' : '-rotate-90'}`} />
                </button>

                {openSections.includes('Values') && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {valueFilters.map(val => {
                      const Icon = val.icon
                      const isActive = selectedValues.includes(val.id)
                      return (
                        <label key={val.id} className="flex items-center gap-3 cursor-pointer group px-2 py-1">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${isActive
                              ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500'
                              : 'border-slate-300 bg-white group-hover:border-emerald-400 dark:border-slate-600 dark:bg-slate-800'
                            }`}>
                            {isActive && <Check size={14} className="text-white" strokeWidth={3} />}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isActive}
                            onChange={() => {
                              setSelectedValues(prev =>
                                prev.includes(val.id) ? prev.filter(id => id !== val.id) : [...prev, val.id]
                              )
                            }}
                          />
                          <Icon size={16} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                          <span className={`text-sm font-medium transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {t(val.key)}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {selectedSeason !== 'All' && (
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700 h-8">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('season')}: <span className="text-emerald-600 font-semibold">{selectedSeason}</span></span>
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.delete('season')
                        setSearchParams(newParams)
                      }}
                      className="text-xs text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition dark:bg-rose-900/20 dark:hover:bg-rose-900/40"
                    >
                      {t('clear')}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  {error}
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                {loading ? t('loading', 'Loading...') : (
                  <>
                    {t('showing')} <span className="font-semibold text-slate-900 dark:text-white">{filteredProducts.length}</span>{' '}
                    {t('products')}
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                    onAddToCart={addItem}
                    onViewDetails={(p) => {
                      setActiveProduct(p)
                      addToRecentlyViewed(p)
                    }}
                  />
                ))
              )}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="mt-10 rounded-3xl border border-dashed border-emerald-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-6 py-12 text-center transition-colors">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('noMatchingProducts')}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('tryDifferentSearch')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        key={activeProduct?.id ?? 'empty'}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addItem}
      />
    </section>
  )
}
