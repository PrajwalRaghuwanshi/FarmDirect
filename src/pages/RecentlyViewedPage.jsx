import { Link } from 'react-router-dom'
import { ChevronLeft, Trash2, History } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/cart-context'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { useState } from 'react'

export default function RecentlyViewedPage() {
  const { recentlyViewed, clearRecentlyViewed, user } = useUser()
  const { addItem } = useCart()
  const [activeProduct, setActiveProduct] = useState(null)

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          to={`/Account/${user?.name?.replace(/\s+/g, '') || 'missing'}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Account
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Recently Viewed</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Products you've recently checked out</p>
          </div>
          {recentlyViewed.length > 0 && (
            <button 
              onClick={clearRecentlyViewed}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-bold text-sm dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}
        </div>

        {recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {recentlyViewed.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p, q) => addItem(p, q)}
                onViewDetails={(p) => setActiveProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <History size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your history is empty</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xs">
              Check out some amazing products from our farmers to see them here!
            </p>
            <Link 
              to="/products"
              className="mt-8 px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              Start Browsing
            </Link>
          </div>
        )}
      </div>

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(p, q) => {
            addItem(p, q)
          }}
        />
      )}
    </div>
  )
}
