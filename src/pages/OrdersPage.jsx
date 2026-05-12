import { useEffect, useMemo, useState } from 'react'
import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import OrderStatusStepper from '../components/OrderStatusStepper'
import ReceiptModal from '../components/ReceiptModal'
import { useCart } from '../context/cart-context'
import { products } from '../data/products'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('current')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const { orderHistory, recentOrder } = useCart()
  const [statusOverrides, setStatusOverrides] = useState({})
  const { t } = useTranslation()

  const mergedOrders = useMemo(() => {
    // Normalize backend data structure to match what the UI expects
    const normalizedHistory = orderHistory.map(o => ({
      ...o,
      id: o._id || o.id,
      placedOn: o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : o.placedOn,
      total: o.summary?.total || o.total,
      receiptItems: o.items || o.receiptItems || []
    }))

    return normalizedHistory
  }, [orderHistory])

  const liveOrders = useMemo(() => mergedOrders.map((order) => {
    const override = statusOverrides[order.id]
    if (!override) return order
    return { ...order, status: override.status, eta: override.eta }
  }), [mergedOrders, statusOverrides])

  // Disabled automatic status simulator to show REAL status from database
  /*
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatusOverrides((current) => {
        const next = { ...current }
        mergedOrders.forEach((order) => {
          const cur = current[order.id]?.status ?? order.status
          if (cur === 'Delivered' || cur === 'Cancelled') return
          const ns = advanceStatus(cur)
          next[order.id] = { status: ns, eta: ns === 'Delivered' ? `Delivered on ${new Date().toLocaleDateString('en-GB')}` : ns === 'Out for Delivery' ? 'Courier is on the way' : order.eta }
        })
        return next
      })
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [mergedOrders, recentOrder])
  */

  const currentOrders = useMemo(() => liveOrders.filter((o) => o.status !== 'Delivered'), [liveOrders])
  const previousOrders = useMemo(() => liveOrders.filter((o) => o.status === 'Delivered'), [liveOrders])
  const visibleOrders = activeTab === 'current' ? currentOrders : previousOrders
  const trackedOrder = currentOrders[0] ?? null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">{t('myOrders')}</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{t('orderDashboard')}</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-400">{t('orderDashboardDesc')}</p>
      </div>

      {trackedOrder && (
        <div className="mb-8 rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">{t('realTimeTracking')}</p>
              <h2 className={`mt-2 text-2xl font-semibold ${trackedOrder.status?.toLowerCase() === 'cancelled' ? 'text-red-600 dark:text-red-500' : 'text-slate-900 dark:text-white'}`}>
                {t('trackingOrder', { id: trackedOrder.id })}
              </h2>
              <p className={`mt-2 text-sm ${trackedOrder.status?.toLowerCase() === 'cancelled' ? 'text-red-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {t('currentStatus', { status: trackedOrder.status, eta: trackedOrder.eta })}
              </p>
            </div>
            <button type="button" onClick={() => setSelectedReceipt(trackedOrder)} className="rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">{t('viewDigitalReceipt')}</button>
          </div>
          {trackedOrder.status === 'Cancelled' && (
            <div className="my-8 flex justify-center">
              <p className="text-2xl font-black text-red-600 dark:text-red-500 uppercase tracking-[0.3em] text-center drop-shadow-sm">
                the order was cancelled
              </p>
            </div>
          )}
          <div className="mt-6"><OrderStatusStepper status={trackedOrder.status} /></div>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('itemsInTransit')}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(trackedOrder.receiptItems || []).map((item, idx) => {
                const productData = products.find(p => p.name === item.name);
                return (
                  <div key={idx} className="flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                      {productData?.image ? (
                        <img src={productData.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('qtyPrice', { count: item.quantity, price: item.price })}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        {[{ id: 'current', labelKey: 'activeOrders' }, { id: 'previous', labelKey: 'orderHistory' }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-emerald-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:text-emerald-700 dark:hover:text-emerald-400'}`}>{t(tab.labelKey)}</button>
        ))}
      </div>

      <div className="space-y-5">
        {visibleOrders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">{t('orderLabel', { id: order.id })}</p>
                <h2 className={`mt-2 text-2xl font-semibold ${order.status?.toLowerCase() === 'cancelled' ? 'text-red-600 dark:text-red-500' : 'text-slate-900 dark:text-white'}`}>
                  {order.status}
                </h2>
                <p className={`mt-2 text-sm ${order.status?.toLowerCase() === 'cancelled' ? 'text-red-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {t('placedOn', { date: order.placedOn, eta: order.eta })}
                </p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>{order.status}</span>
            </div>
            {order.status === 'Cancelled' && (
              <div className="mt-6 flex justify-center">
                <p className="text-lg font-black text-red-600 uppercase tracking-[0.2em] text-center">
                  the order was cancelled
                </p>
              </div>
            )}
            <div className="mt-5"><OrderStatusStepper status={order.status} /></div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t('itemsInThisOrder')}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(order.receiptItems || []).map((item, idx) => {
                  const productData = products.find(p => p.name === item.name);
                  return (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-700 p-2.5">
                      <div className="h-12 w-12 shrink-0 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                        {productData?.image ? (
                          <img src={productData.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('qty', { count: item.quantity })}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {order.total ? <p className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">{t('totalAmount', { amount: order.total })}</p> : null}
              <button type="button" onClick={() => setSelectedReceipt(order)} className="mt-4 rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">{t('viewDigitalReceipt')}</button>
            </div>
          </article>
        ))}
        {visibleOrders.length === 0 && (
          <div className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('noOrdersYet')}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('noOrdersDesc')}</p>
          </div>
        )}
      </div>
      <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </section>
  )
}
