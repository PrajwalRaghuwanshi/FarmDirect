import { Heart, ShoppingCart } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const primarySeller = product.sellers?.[0]
  const { wishlist, toggleWishlist } = useUser()
  const { t } = useTranslation()
  const isWishlisted = wishlist.some(item => item.id === product.id)

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
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </button>

      <div className="flex flex-1 flex-col space-y-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[clamp(0.55rem,0.5vw+0.4rem,0.65rem)] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 truncate">
              {product.category}
            </p>
            <h2 className="mt-1 text-[clamp(0.85rem,1vw+0.6rem,1rem)] font-extrabold text-slate-900 dark:text-white leading-[1.2] line-clamp-2">
              {product.name}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[clamp(0.5rem,0.4vw+0.4rem,0.6rem)] font-bold text-amber-700 dark:text-amber-400 h-fit">
            {product.stock_level} {t('left')}
          </span>
        </div>

        <div className="space-y-1 text-[clamp(0.65rem,0.6vw+0.45rem,0.75rem)] text-slate-600 dark:text-slate-400">
          <p className="flex items-center gap-1.5 truncate">
            <span className="opacity-60 shrink-0">{t('origin')}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{product.farm_name}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="opacity-60 shrink-0">{t('price')}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              Rs. {primarySeller?.price ?? product.price}/{product.unit}
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
            className="flex-1 h-10 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white transition hover:brightness-110 shadow-lg shadow-emerald-900/10 flex items-center justify-center"
            title={t('addToCart')}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}
