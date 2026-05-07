import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/cart-context'

export default function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist } = useUser()
  const { addItem } = useCart()

  const handleBuyNow = (item) => {
    const primarySeller = item.sellers?.[0]
    addItem({
      ...item,
      cartKey: `${item.id}-${primarySeller?.id ?? 'default'}`,
      sellerId: primarySeller?.id ?? 'default',
      sellerName: primarySeller?.name ?? item.farm_name,
      farm_name: primarySeller?.name ?? item.farm_name,
      price: primarySeller?.price ?? item.price,
      stock_level: primarySeller?.stock_level ?? item.stock_level,
    }, 1)
    navigate('/cart')
  }

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Heart className="text-rose-500 fill-rose-500" size={32} />
              My Wishlist
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Products you've saved for later</p>
          </div>
        </div>

        {/* Wishlist List */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          {wishlist.length > 0 ? (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {wishlist.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-sm">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {item.farm_name} • <span className="text-emerald-600 font-bold text-base">Rs. {item.price}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-900/30 text-amber-600 px-2 py-0.5 rounded-md">
                        {item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleBuyNow(item)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white text-sm font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                      <ShoppingCart size={16} />
                      Buy Now
                    </button>
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="p-3.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 transition-all hover:scale-110 active:scale-90"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-8 text-slate-200 dark:text-slate-700">
                <Heart size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-lg leading-relaxed">
                Found something you like? Heart it to keep track of it here.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
              >
                Browse Fresh Harvests
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        {wishlist.length > 0 && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-sm text-emerald-800 dark:text-emerald-400 text-center font-medium italic">
              "Items in your wishlist are saved locally. Prices and availability are subject to change based on the current harvest cycle."
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
