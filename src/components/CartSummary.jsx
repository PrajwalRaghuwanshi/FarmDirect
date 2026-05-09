import { useTranslation } from 'react-i18next'

export default function CartSummary({
  itemCount,
  subtotal,
  deliveryFee,
  total,
  ctaLabel,
  onCtaClick,
}) {
  const { t } = useTranslation()
  return (
    <aside className="rounded-[2rem] border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('orderSummary')}</h2>
      <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span>{t('items')}</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t('subtotal')}</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t('deliveryFee')}</span>
          <span>Rs. {deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 text-base font-semibold text-slate-900 dark:text-white">
          <span>{t('total')}</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      {ctaLabel && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-6 w-full rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          {ctaLabel}
        </button>
      )}
    </aside>
  )
}
