import { useEffect, useState } from 'react'
import { Heart, X } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTranslation } from 'react-i18next'

export default function ProductModal({ product, onClose, onAddToCart }) {
  const { wishlist, toggleWishlist } = useUser()
  const { t } = useTranslation()
  const isWishlisted = product ? wishlist.some(item => item.id === product.id) : false
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
  const maxQuantity = selectedSeller?.stock_level ?? product.stock_level
  const parsedQuantity = Number(quantity) || 0
  const liveTotal = (selectedSeller?.price ?? product.price) * parsedQuantity

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative group">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full rounded-[2rem] object-cover lg:h-full shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
                  {product.category}
                </p>
                <h2 id="product-modal-title" className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all active:scale-95 ${isWishlisted
                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-rose-300 hover:text-rose-500'
                    }`}
                  title={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                  title={t('close')}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <p className="text-base leading-7 text-slate-600 dark:text-slate-400">{product.description}</p>

            <div className="grid gap-3 rounded-3xl bg-emerald-50 dark:bg-slate-800 p-5 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">{t('farm')}:</span>{' '}
                {selectedSeller?.name ?? product.farm_name}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">{t('origin')}:</span> {product.origin}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">{t('price')}:</span> Rs.{' '}
                {selectedSeller?.price ?? product.price}/{product.unit}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">{t('stockLevel')}:</span>{' '}
                {selectedSeller?.stock_level ?? product.stock_level}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">{t('rating')}:</span> {product.rating}/5
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {t('buyFromSellers')}
              </h3>
              <div className="mt-3 space-y-3">
                {product.sellers?.map((seller) => {
                  const isSelected = seller.id === selectedSeller?.id

                  return (
                    <button
                      key={seller.id}
                      type="button"
                      onClick={() => setSelectedSellerId(seller.id)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${isSelected
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
                            {t('stock')}: {seller.stock_level}
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
                {t('highlights')}
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
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
                {t('quantity')}
                <input
                  type="number"
                  min="0"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(event) => {
                    const val = event.target.value;
                    if (val === '') {
                      setQuantity('');
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (isNaN(num)) return;
                    setQuantity(Math.min(num, maxQuantity));
                  }}
                  className="w-16 rounded-xl border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-2 text-center text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </label>
              <div className="rounded-2xl bg-emerald-50 dark:bg-slate-800 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight flex-shrink-0">
                {t('total')}<br />
                <span className="text-sm text-slate-900 dark:text-white normal-case tracking-normal">Rs. {liveTotal}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!selectedSeller) {
                    return
                  }
                  if (parsedQuantity <= 0) {
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
                    parsedQuantity,
                  )
                  onClose()
                }}
                className="rounded-full bg-slate-900 dark:bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600 whitespace-nowrap sm:ml-auto flex-shrink-0"
                disabled={!selectedSeller}
              >
                {t('addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
