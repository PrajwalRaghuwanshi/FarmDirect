import { useEffect, useMemo, useState } from 'react'
import OrderStatusStepper from '../components/OrderStatusStepper'
import ReceiptModal from '../components/ReceiptModal'
import { useCart } from '../context/cart-context'
import { orders } from '../data/orders'
import { advanceStatus } from '../utils/orderStatus'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('current')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const { orderHistory, recentOrder } = useCart()
  const [statusOverrides, setStatusOverrides] = useState({})
  const mergedOrders = useMemo(() => [...orderHistory, ...orders], [orderHistory])
  const liveOrders = useMemo(() => mergedOrders.map((order) => {
    const override = statusOverrides[order.id]
    if (!override) return order
    return { ...order, status: override.status, eta: override.eta }
  }), [mergedOrders, statusOverrides])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatusOverrides((current) => {
        const next = { ...current }
        mergedOrders.forEach((order) => {
          const cur = current[order.id]?.status ?? order.status
          if (cur === 'Delivered') return
          const ns = advanceStatus(cur)
          next[order.id] = { status: ns, eta: ns === 'Delivered' ? `Delivered on ${new Date().toLocaleDateString('en-GB')}` : ns === 'Out for Delivery' ? 'Courier is on the way' : order.eta }
        })
        return next
      })
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [mergedOrders, recentOrder])

  const currentOrders = useMemo(() => liveOrders.filter((o) => o.status !== 'Delivered'), [liveOrders])
  const previousOrders = useMemo(() => liveOrders.filter((o) => o.status === 'Delivered'), [liveOrders])
  const visibleOrders = activeTab === 'current' ? currentOrders : previousOrders
  const trackedOrder = currentOrders[0] ?? previousOrders[0] ?? null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">My Orders</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Order dashboard and tracking</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-400">Follow live fulfillment progress, review your order history, and open digital receipts. Status updates advance every 30 seconds for testing.</p>
      </div>

      {trackedOrder && (
        <div className="mb-8 rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Real-Time Order Tracking</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Tracking Order {trackedOrder.id}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Current status: {trackedOrder.status} • {trackedOrder.eta}</p>
            </div>
            <button type="button" onClick={() => setSelectedReceipt(trackedOrder)} className="rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">View Digital Receipt</button>
          </div>
          <div className="mt-6"><OrderStatusStepper status={trackedOrder.status} /></div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        {[{ id: 'current', label: 'Active Orders' }, { id: 'previous', label: 'Order History' }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-emerald-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:text-emerald-700 dark:hover:text-emerald-400'}`}>{tab.label}</button>
        ))}
      </div>

      <div className="space-y-5">
        {visibleOrders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Order {order.id}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{order.status}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Placed on {order.placedOn} • {order.eta}</p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{order.status}</span>
            </div>
            <div className="mt-5"><OrderStatusStepper status={order.status} /></div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Items in this order</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {order.items.map((item) => (<li key={item} className="rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm text-slate-600 dark:text-slate-400">{item}</li>))}
              </ul>
              {order.total ? <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Total: Rs. {order.total}</p> : null}
              <button type="button" onClick={() => setSelectedReceipt(order)} className="mt-4 rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400">View Digital Receipt</button>
            </div>
          </article>
        ))}
        {visibleOrders.length === 0 && (
          <div className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">No orders in this section yet</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Place a new order to see it here, or switch tabs to review your other purchases.</p>
          </div>
        )}
      </div>
      <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </section>
  )
}
