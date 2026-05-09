import { useNavigate } from 'react-router-dom'
import CartSummary from '../components/CartSummary'
import { useCart } from '../context/cart-context'
import { useTranslation } from 'react-i18next'

export default function CartPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { items, itemCount, subtotal, deliveryFee, total, updateQuantity, removeItem } =
    useCart()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          {t('yourCart')}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{t('reviewYourBasket')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('yourCartIsEmpty')}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {t('addFreshProduce')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="mt-6 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              >
                {t('browseProducts')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.cartKey}
                className="grid gap-4 rounded-[2rem] bg-white dark:bg-slate-800 p-5 shadow-sm sm:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-full rounded-3xl object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t('seller')}: {item.sellerName ?? item.farm_name}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Rs. {item.price}/{item.unit}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <label className="text-sm text-slate-600 dark:text-slate-400">
                    {t('qty')}
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.cartKey, Number(event.target.value) || 0)
                      }
                      className="mt-2 block w-24 rounded-full border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Rs. {item.price * item.quantity}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.cartKey)}
                    className="text-sm font-semibold text-rose-600 dark:text-rose-400"
                  >
                    {t('remove')}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <CartSummary
          itemCount={itemCount}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          ctaLabel={t('proceedToCheckout')}
          onCtaClick={() => navigate('/checkout')}
        />
      </div>
    </section>
  )
}
