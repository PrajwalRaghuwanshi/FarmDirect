export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const primarySeller = product.sellers?.[0]

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button type="button" onClick={() => onViewDetails(product)} className="block w-full">
        <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
      </button>

      <div className="flex flex-1 flex-col space-y-2 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              {product.category}
            </p>
            <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
            Stock: {product.stock_level}
          </span>
        </div>

        <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-400">
          <p>
            Farm origin:{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">{product.farm_name}</span>
          </p>
          <p>
            Price:{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              Rs. {primarySeller?.price ?? product.price}/{product.unit}
            </span>
          </p>
          <p>
            Seller:{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {primarySeller?.name ?? product.farm_name}
            </span>
          </p>
        </div>

        <div className="mt-auto flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 rounded-full border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            View Details
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
            className="flex-1 rounded-full bg-slate-900 dark:bg-emerald-700 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
