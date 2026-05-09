import { useEffect, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import CategoryChips from '../components/CategoryChips'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import { products } from '../data/products'
import { useTranslation } from 'react-i18next'

const categories = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Organic']

export default function ProductsPage() {
  const { addItem } = useCart()
  const { addToRecentlyViewed, pincode, locationInfo } = useUser()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeProduct, setActiveProduct] = useState(null)

  // Read category and season from URL or default to 'All'
  const selectedCategory = searchParams.get('category') || 'All'
  const selectedSeason = searchParams.get('season') || 'All'

  function handleCategorySelect(category) {
    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory
      const matchesSeason =
        selectedSeason === 'All' || product.season === selectedSeason

      return matchesCategory && matchesSeason
    })
  }, [selectedCategory, selectedSeason])

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
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-0.5">{pincode}</p>
                  {locationInfo && (
                    <p className="text-xs font-medium text-slate-400 truncate max-w-[120px]">
                      ({locationInfo.district}, {locationInfo.state})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
          {selectedSeason !== 'All' && (
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700 h-8">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('season')}: <span className="text-emerald-600 font-semibold">{selectedSeason}</span></span>
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('season')
                  setSearchParams(newParams)
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition"
              >
                {t('clear')}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('showing')} <span className="font-semibold text-slate-900 dark:text-white">{filteredProducts.length}</span>{' '}
            {t('products')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-emerald-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-6 py-12 text-center transition-colors">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('noMatchingProducts')}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('tryDifferentSearch')}
          </p>
        </div>
      )}

      <ProductModal
        key={activeProduct?.id ?? 'empty'}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addItem}
      />
    </section>
  )
}
