import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'

export default function CheckoutSuccessPage() {
  const { recentOrder } = useCart()

  return (
    <section className="receipt-page mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="receipt-card rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          Checkout Success
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
          Your order has been placed
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          {recentOrder
            ? `Order ${recentOrder.id} is confirmed and will be prepared for dispatch shortly.`
            : 'Your latest order is confirmed and our partner farms are getting it ready.'}
        </p>

        {recentOrder && (
          <div className="mt-8 space-y-6 rounded-[1.5rem] bg-emerald-50 dark:bg-slate-700 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Receipt for Order {recentOrder.id}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Placed on {recentOrder.placedOn} • {recentOrder.eta}
                </p>
              </div>
              <span className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                {recentOrder.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white dark:bg-slate-800 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                  Customer
                </h3>
                <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <p>{recentOrder.customerDetails?.fullName || 'Guest customer'}</p>
                  <p>{recentOrder.customerDetails?.phoneNumber || 'No phone provided'}</p>
                  <p>{recentOrder.customerDetails?.emailAddress || 'No email provided'}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                  Delivery
                </h3>
                <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <p>{recentOrder.customerDetails?.streetAddress || 'No address provided'}</p>
                  <p>
                    {[recentOrder.customerDetails?.city, recentOrder.customerDetails?.postalCode]
                      .filter(Boolean)
                      .join(', ') || 'No city or postal code provided'}
                  </p>
                  <p>
                    {recentOrder.customerDetails?.deliveryNotes || 'No delivery notes added'}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-slate-100 dark:border-slate-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <span>Item</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span>Line Total</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentOrder.items.map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span>
                      {item.name}
                      <span className="block text-xs text-slate-500 dark:text-slate-400">per {item.unit}</span>
                    </span>
                    <span>{item.quantity}</span>
                    <span>Rs. {item.price}</span>
                    <span>Rs. {item.lineTotal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-auto max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-5">
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {recentOrder.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <span>Rs. {recentOrder.deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2 text-base font-semibold text-slate-900 dark:text-white">
                  <span>Total paid</span>
                  <span>Rs. {recentOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="receipt-actions mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Print Receipt
          </button>
          <Link
            to="/orders"
            className="rounded-full bg-slate-900 dark:bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Track Order
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-slate-200 dark:border-slate-600 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  )
}
