import { Heart, ShoppingCart } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const primarySeller = product.sellers?.[0]
  const { wishlist, toggleWishlist } = useUser()
  const { t } = useTranslation()
  const productId = product.id || product._id
  const isWishlisted = wishlist.some(item => (item.id || item._id) === productId)

  const productName = product.name || product.title || 'Untitled Product'
  const productImage = (Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80')
  const farmName = product.owner?.name || product.farm_name || 'Local Farm'
  const productPrice = primarySeller?.price ?? product.price
  const productUnit = product.unit || 'kg'
  const stockLevel = (primarySeller?.stock_level ?? product.stock) || product.stock_level || 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg group relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleWishlist(product)
        }}
        className={`absolute top-3 right-3 z-20 h-8 w-8 rounded-full flex items-center justify-center transition-all ${isWishlisted
          ? 'bg-rose-500 text-white shadow-lg'
          : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <button type="button" onClick={() => onViewDetails(product)} className="block w-full overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </button>

      <div className="flex flex-1 flex-col space-y-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[clamp(0.55rem,0.5vw+0.4rem,0.65rem)] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 truncate">
              {product.category || 'General'}
            </p>
            <h2 className="mt-1 text-[clamp(0.85rem,1vw+0.6rem,1rem)] font-extrabold text-slate-900 dark:text-white leading-[1.2] line-clamp-2">
              {productName}
            </h2>
          </div>
          {stockLevel > 10 ? (
            <span className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[clamp(0.5rem,0.4vw+0.4rem,0.6rem)] font-bold text-emerald-700 dark:text-emerald-400 h-fit">
              {t('inStock', 'In Stock')}
            </span>
          ) : stockLevel > 0 ? (
            <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[clamp(0.5rem,0.4vw+0.4rem,0.6rem)] font-bold text-amber-700 dark:text-amber-400 h-fit">
              {stockLevel} {t('fewLeft', 'Few Left')}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 text-[clamp(0.5rem,0.4vw+0.4rem,0.6rem)] font-bold text-rose-700 dark:text-rose-400 h-fit">
              {t('outOfStock', 'Out of Stock')}
            </span>
          )}
        </div>

        <div className="space-y-1 text-[clamp(0.65rem,0.6vw+0.45rem,0.75rem)] text-slate-600 dark:text-slate-400">
          <p className="flex items-center gap-1.5 truncate">
            <span className="opacity-60 shrink-0">{t('origin')}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{farmName}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="opacity-60 shrink-0">{t('price')}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              Rs. {productPrice}/{productUnit}
            </span>
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-[clamp(0.65rem,0.5vw+0.45rem,0.75rem)] font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            {t('details')}
          </button>
          <button
            type="button"
            onClick={() =>
              onAddToCart(
                {
                  ...product,
                  cartKey: `${product.id}-${primarySeller?.id ?? 'default'}`,
                  sellerId: primarySeller?.id ?? 'default',
                  sellerName: primarySeller?.name ?? product.farm_name,
                  farm_name: primarySeller?.name ?? product.farm_name,
                  price: primarySeller?.price ?? product.price,
                  stock_level: primarySeller?.stock_level ?? product.stock_level,
                },
                1,
              )
            }
            className={`flex-1 h-10 rounded-xl transition shadow-lg flex items-center justify-center ${
              stockLevel <= 0 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500' 
                : 'bg-slate-900 dark:bg-emerald-700 text-white hover:brightness-110 shadow-emerald-900/10'
            }`}
            disabled={stockLevel <= 0}
            title={stockLevel <= 0 ? t('outOfStock') : t('addToCart')}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}
