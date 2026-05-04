import { Link } from 'react-router-dom'
import { ChevronLeft, Trash2, Star, ShoppingCart } from 'lucide-react'

export default function RecentlyViewedPage() {
  const recentProducts = [
    { id: 1, name: 'Alphonso Mangoes', price: 1200, category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80', rating: 4.9 },
    { id: 2, name: 'Organic Honey', price: 450, category: 'Organic', image: 'https://images.unsplash.com/photo-1587049352847-4d4b137a4e4a?auto=format&fit=crop&w=300&q=80', rating: 4.8 },
    { id: 3, name: 'Basmati Rice', price: 250, category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
  ]

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          to="/Account/User" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Account
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Recently Viewed</h1>
          <button className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-bold text-sm">
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-slate-900">{product.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{product.price}</span>
                  <button className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-90">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
