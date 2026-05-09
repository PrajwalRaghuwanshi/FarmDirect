import { useTranslation } from 'react-i18next'

export default function ReceiptModal({ order, onClose }) {
  const { t } = useTranslation()
  if (!order) {
    return null
  }

  const receiptItems = order.receiptItems ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              {t('digitalReceipt')}
            </p>
            <h2 id="receipt-modal-title" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {t('order')} {order.id}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('placedOn')} {order.placedOn}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            {t('close')}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              {t('customer')}
            </h3>
            <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <p>{order.customerDetails?.fullName || t('marketplaceCustomer')}</p>
              <p>{order.customerDetails?.phoneNumber || t('phoneUnavailable')}</p>
              <p>{order.customerDetails?.emailAddress || t('emailUnavailable')}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              {t('delivery')}
            </h3>
            <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <p>{order.customerDetails?.streetAddress || t('addressUnavailable')}</p>
              <p>
                {[order.customerDetails?.city, order.customerDetails?.postalCode]
                  .filter(Boolean)
                  .join(', ') || t('cityPostalUnavailable')}
              </p>
              <p>{order.eta}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-[1.4fr_0.6fr_0.8fr_0.8fr] gap-4 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span>{t('item')}</span>
            <span>{t('qty')}</span>
            <span>{t('unitPrice')}</span>
            <span>{t('lineTotal')}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {receiptItems.map((item) => (
              <div
                key={`${order.id}-${item.name}`}
                className="grid grid-cols-[1.4fr_0.6fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-sm text-slate-700 dark:text-slate-300"
              >
                <span>{item.name}</span>
                <span>{item.quantity}</span>
                <span>Rs. {item.price}</span>
                <span>Rs. {item.lineTotal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 ml-auto max-w-sm rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>{t('subtotal')}</span>
              <span>Rs. {order.subtotal ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t('deliveryFee')}</span>
              <span>Rs. {order.deliveryFee ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-base font-semibold text-slate-900 dark:text-white">
              <span>{t('totalPaid')}</span>
              <span>Rs. {order.total ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
