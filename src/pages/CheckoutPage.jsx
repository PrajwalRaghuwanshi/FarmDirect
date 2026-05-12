import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CartSummary from '../components/CartSummary'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { items, itemCount, subtotal, deliveryFee, total, placeOrder } = useCart()
  const { user, pincode, locationInfo } = useUser()

  // Initialize form with existing user data if available
  const [formData, setFormData] = useState(() => {
    // Try to get default address from localStorage
    const savedAddresses = localStorage.getItem('farmdirect-addresses')
    let defaultAddr = null
    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses)
        defaultAddr = addresses.find(a => a.isDefault)
      } catch (e) {
        console.error(e)
      }
    }

    return {
      fullName: user?.name || defaultAddr?.name || '',
      phoneNumber: user?.mobile || defaultAddr?.phoneNumber || '',
      emailAddress: user?.email || defaultAddr?.emailAddress || '',
      postalCode: pincode || defaultAddr?.pincode || '',
      city: locationInfo?.district || defaultAddr?.city || '',
      state: locationInfo?.state || defaultAddr?.state || '',
      streetAddress: defaultAddr?.address || '',
      deliveryNotes: '',
    }
  })

  const [loadingLocation, setLoadingLocation] = useState(false)

  function updateField(field, value) {
    if (field === 'phoneNumber') {
      // Integer only and max 10 digits
      const sanitized = value.replace(/\D/g, '').slice(0, 10)
      setFormData((current) => ({ ...current, [field]: sanitized }))
      return
    }
    setFormData((current) => ({ ...current, [field]: value }))
  }

  // Pincode Autofill Logic
  useEffect(() => {
    if (formData.postalCode.length === 6) {
      const fetchLocation = async () => {
        setLoadingLocation(true)
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.postalCode}`)
          const data = await res.json()
          if (data && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0]
            setFormData(prev => ({ 
              ...prev, 
              city: postOffice.District, 
              state: postOffice.State 
            }))
          }
        } catch (err) {
          console.error("Location fetch failed:", err)
        } finally {
          setLoadingLocation(false)
        }
      }
      fetchLocation()
    }
  }, [formData.postalCode])

  const [placingOrder, setPlacingOrder] = useState(false)

  async function handlePlaceOrder(e) {
    if (e) e.preventDefault()
    if (items.length === 0 || placingOrder) return

    // Simple email validation for '@'
    if (!formData.emailAddress.includes('@')) {
      alert(t('validEmailAlert'))
      return
    }

    if (formData.phoneNumber.length !== 10) {
      alert(t('phoneDigitsAlert'))
      return
    }

    setPlacingOrder(true)
    try {
      await placeOrder(formData)
      navigate('/checkout/success')
    } catch (err) {
      console.error(err)
      alert("Something went wrong while placing your order. Please try again.")
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          {t('checkout')}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{t('completeYourDelivery')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handlePlaceOrder} className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('fullNameLabel')}
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder={t('enterFullName')}
                className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </label>

            {/* Phone Number */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('phoneNumber')}
              <input
                required
                type="tel"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                placeholder={t('tenDigitNumber')}
                className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </label>

            {/* Email Address */}
            <label className="md:col-span-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('emailAddressLabel')}
              <input
                required
                type="email"
                value={formData.emailAddress}
                onChange={(e) => updateField('emailAddress', e.target.value)}
                placeholder="yourname@example.com"
                className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </label>

            {/* Pincode (Asked First) */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('postalCode')}
              <div className="relative">
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={formData.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  placeholder={t('sixDigitPincode')}
                  className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
                {loadingLocation && <Loader2 className="absolute right-4 top-[60%] -translate-y-1/2 text-emerald-600 animate-spin" size={18} />}
              </div>
            </label>

            {/* City (Auto-filled) */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('townCity')}
              <div className="relative">
                <input
                  required
                  readOnly
                  type="text"
                  value={formData.city}
                  placeholder={t('enterPincodeFirst')}
                  className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none cursor-not-allowed"
                />
                {!loadingLocation && formData.city && <CheckCircle2 className="absolute right-4 top-[60%] -translate-y-1/2 text-emerald-500" size={18} />}
              </div>
            </label>

            {/* State (Auto-filled) */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('state')}
              <input
                required
                readOnly
                type="text"
                value={formData.state}
                placeholder={t('enterPincodeFirst')}
                className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none cursor-not-allowed"
              />
            </label>

            {/* Street Address */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('streetAddress')}
              <input
                required
                type="text"
                value={formData.streetAddress}
                onChange={(e) => updateField('streetAddress', e.target.value)}
                placeholder={t('streetAddressPlaceholder')}
                className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <label className="mt-6 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('deliveryNotes')}
            <textarea
              rows="4"
              value={formData.deliveryNotes}
              onChange={(event) => updateField('deliveryNotes', event.target.value)}
              placeholder={t('deliveryNotesPlaceholder')}
              className="mt-2 w-full rounded-2xl border border-emerald-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500"
            />
          </label>

          <div className="mt-6 rounded-3xl bg-emerald-50 dark:bg-slate-700 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('orderPreview')}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {items.length === 0 ? (
                <li>{t('cartCurrentlyEmpty')}</li>
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
            type="submit"
            disabled={items.length === 0 || placingOrder}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-emerald-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600 min-w-[200px]"
          >
            {placingOrder ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t('processing')}...
              </>
            ) : (
              t('placeMockOrder')
            )}
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
