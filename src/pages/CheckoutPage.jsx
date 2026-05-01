import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartSummary from '../components/CartSummary'
import { useCart } from '../context/cart-context'

const initialForm = {
  fullName: '',
  phoneNumber: '',
  emailAddress: '',
  city: '',
  streetAddress: '',
  postalCode: '',
  deliveryNotes: '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, deliveryFee, total, placeOrder } = useCart()
  const [formData, setFormData] = useState(initialForm)

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  function handlePlaceOrder() {
    if (items.length === 0) {
      return
    }

    placeOrder(formData)
    navigate('/checkout/success')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          Checkout
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Complete your delivery</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                key: 'fullName',
                label: 'Full name',
                type: 'text',
              },
              {
                key: 'phoneNumber',
                label: 'Phone number',
                type: 'tel',
              },
              {
                key: 'emailAddress',
                label: 'Email address',
                type: 'email',
              },
              {
                key: 'city',
                label: 'City',
                type: 'text',
              },
              {
                key: 'streetAddress',
                label: 'Street address',
                type: 'text',
              },
              {
                key: 'postalCode',
                label: 'Postal code',
                type: 'text',
              },
            ].map((field) => (
              <label key={field.key} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {field.label}
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  placeholder={field.label}
                  className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Delivery notes
            <textarea
              rows="4"
              value={formData.deliveryNotes}
              onChange={(event) => updateField('deliveryNotes', event.target.value)}
              placeholder="Share pickup preferences, landmark details, or handling notes"
              className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500"
            />
          </label>

          <div className="mt-6 rounded-3xl bg-emerald-50 dark:bg-slate-700 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order preview</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {items.length === 0 ? (
                <li>Your cart is currently empty.</li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="mt-6 rounded-full bg-slate-900 dark:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
            disabled={items.length === 0}
          >
            Place Mock Order
          </button>
        </form>

        <CartSummary
          itemCount={itemCount}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />
      </div>
    </section>
  )
}
