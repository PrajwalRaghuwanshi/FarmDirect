import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Leaf, Users, ChevronRight, Loader2, Filter, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { addToRecentlyViewed } = useUser()
  
  const [products, setProducts] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeProduct, setActiveProduct] = useState(null)
  const [filterType, setFilterType] = useState('all') // 'all' | 'products' | 'farmers'

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
        
        // Fetch products and farmers in parallel
        const [prodRes, farmRes] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/farmers`)
        ]);
        
        const prodData = await prodRes.json();
        const farmData = await farmRes.json();
        
        const allProducts = Array.isArray(prodData) ? prodData : [];
        const allFarmers = Array.isArray(farmData) ? farmData : (farmData.farmers || []);

        // Client-side filtering for better UX with search query
        const filteredProducts = allProducts.filter(p => 
          (p.title || p.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(query.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(query.toLowerCase())
        );

        const filteredFarmers = allFarmers.filter(f => 
          (f.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (f.city || '').toLowerCase().includes(query.toLowerCase()) ||
          (f.state || '').toLowerCase().includes(query.toLowerCase()) ||
          (f.crops || []).some(c => c.toLowerCase().includes(query.toLowerCase()))
        );

        setProducts(filteredProducts);
        setFarmers(filteredFarmers);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false)
      }
    };

    if (query) fetchResults();
  }, [query]);

  const totalResults = products.length + farmers.length;

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen pb-24 transition-colors">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-[0.2em] mb-2">{t('searchResults', 'Search Results')}</p>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {query ? `"${query}"` : t('allProduce', 'All Produce')}
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                {t('foundResults', { count: totalResults })} {t('matchingItems', 'matching items found')}
              </p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl">
              {[
                { id: 'all', label: t('all', 'All'), count: totalResults },
                { id: 'products', label: t('products', 'Products'), count: products.length },
                { id: 'farmers', label: t('farmers', 'Farmers'), count: farmers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    filterType === tab.id 
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filterType === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
            <p className="mt-4 text-slate-500 font-medium">{t('searching', 'Searching the fields...')}</p>
          </div>
        ) : totalResults > 0 ? (
          <div className="space-y-16">
            {/* Farmers Results */}
            {(filterType === 'all' || filterType === 'farmers') && farmers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('farmers', 'Farmers')}</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {farmers.map(farmer => (
                    <Link 
                      key={farmer._id || farmer.id}
                      to={`/farm-profile/${encodeURIComponent(farmer.name)}`}
                      className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img 
                            src={farmer.profilePhoto}
                            alt={farmer.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{farmer.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Leaf size={12} className="text-emerald-500" />
                            {farmer.crops?.join(', ') || 'Various Crops'}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                             <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-500">{farmer.city}, {farmer.state}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Products Results */}
            {(filterType === 'all' || filterType === 'products') && products.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Leaf size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('products', 'Products')}</h2>
                </div>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {products.map(product => (
                    <ProductCard
                      key={product._id || product.id}
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
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-8">
              <Search size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('noResultsTitle', 'No matches found')}</h2>
            <p className="mt-2 text-slate-500 max-w-sm">
              {t('noResultsDesc', "We couldn't find anything matching your search. Try different keywords or browse our categories.")}
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/products" className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                {t('browseStore', 'Browse Store')}
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {t('goBack', 'Go Back')}
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        key={activeProduct?.id || 'empty'}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addItem}
      />
    </div>
  )
}
