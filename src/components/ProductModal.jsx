import { useEffect, useState } from 'react'

export default function ProductModal({ product, onClose, onAddToCart }) {
  const defaultSeller = product?.sellers?.[0] ?? null
  const [quantity, setQuantity] = useState(1)
  const [selectedSellerId, setSelectedSellerId] = useState(defaultSeller?.id ?? '')

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!product) {
    return null
  }

  const selectedSeller =
    product.sellers?.find((seller) => seller.id === selectedSellerId) ?? defaultSeller
  const liveTotal = (selectedSeller?.price ?? product.price) * quantity
  const maxQuantity = selectedSeller?.stock_level ?? product.stock_level

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full rounded-[1.5rem] object-cover lg:h-full"
          />

          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
                  {product.category}
                </p>
                <h2 id="product-modal-title" className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <p className="text-base leading-7 text-slate-600 dark:text-slate-400">{product.description}</p>

            <div className="grid gap-3 rounded-3xl bg-emerald-50 dark:bg-slate-800 p-5 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Farm:</span>{' '}
                {selectedSeller?.name ?? product.farm_name}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Origin:</span> {product.origin}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Price:</span> Rs.{' '}
                {selectedSeller?.price ?? product.price}/{product.unit}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Stock level:</span>{' '}
                {selectedSeller?.stock_level ?? product.stock_level}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">Rating:</span> {product.rating}/5
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Buy from sellers
              </h3>
              <div className="mt-3 space-y-3">
                {product.sellers?.map((seller) => {
                  const isSelected = seller.id === selectedSeller?.id

                  return (
                    <button
                      key={seller.id}
                      type="button"
                      onClick={() => setSelectedSellerId(seller.id)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{seller.name}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{seller.delivery}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Rs. {seller.price}/{product.unit}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Stock: {seller.stock_level}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Highlights
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-2xl border border-slate-100 dark:border-slate-700 px-4 py-3">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          Number(event.target.value) || 1,
                          maxQuantity,
                        ),
                      ),
                    )
                  }
                  className="w-24 rounded-full border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </label>
              <div className="rounded-full bg-emerald-50 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                Total: Rs. {liveTotal}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!selectedSeller) {
                    return
                  }

                  onAddToCart(
                    {
                      ...product,
                      cartKey: `${product.id}-${selectedSeller.id}`,
                      sellerId: selectedSeller.id,
                      sellerName: selectedSeller.name,
                      farm_name: selectedSeller.name,
                      price: selectedSeller.price,
                      stock_level: selectedSeller.stock_level,
                    },
                    quantity,
                  )
                  onClose()
                }}
                className="rounded-full bg-slate-900 dark:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600"
                disabled={!selectedSeller}
              >
                Add {quantity} to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
