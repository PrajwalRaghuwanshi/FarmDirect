import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, MapPin, CheckCircle2, Loader2 } from 'lucide-react'

export default function AddAddressPage() {
  const navigate = useNavigate()
  const { updatePincode } = useUser()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', // Empty by default
    type: 'Home',
    line1: '', 
    line2: '', 
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    isDefault: false
  })

  // Load existing address if editing
  useEffect(() => {
    if (editId) {
      const saved = localStorage.getItem('farmdirect-addresses')
      if (saved) {
        const addresses = JSON.parse(saved)
        const toEdit = addresses.find(a => a.id === parseInt(editId))
        if (toEdit) {
          // Parse the stored address string back into line1 and line2 if possible
          // For simplicity in this dummy, we'll just map it
          setFormData({
            ...toEdit,
            line1: toEdit.line1 || toEdit.address.split(',')[0],
            line2: toEdit.line2 || (toEdit.address.split(',')[1] || '').trim(),
          })
        }
      }
    }
  }, [editId])

  const [autofilling, setAutofilling] = useState(false)

  // Real autofill logic using India Post API Directly
  useEffect(() => {
    if (formData.pincode.length === 6) {
      const fetchLocation = async () => {
        setAutofilling(true)
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
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
          console.error("Failed to fetch location:", err)
        } finally {
          setAutofilling(false)
        }
      }
      fetchLocation()
    }
  }, [formData.pincode])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      const saved = localStorage.getItem('farmdirect-addresses')
      let addresses = saved ? JSON.parse(saved) : [
        { id: 1, type: 'Home', name: 'Prajwal Raghuwanshi', address: '123 Green Valley, Nashik Road', city: 'Nashik', state: 'Maharashtra', pincode: '422001', isDefault: true },
        { id: 2, type: 'Work', name: 'Prajwal Raghuwanshi', address: 'Office 404, Tech Park, Shivajinagar', city: 'Pune', state: 'Maharashtra', pincode: '411005', isDefault: false },
      ]

      const newAddress = {
        ...formData,
        id: editId ? parseInt(editId) : Date.now(),
        address: `${formData.line1}, ${formData.line2}${formData.landmark ? ', ' + formData.landmark : ''}`
      }

      if (formData.isDefault) {
        addresses = addresses.map(a => ({ ...a, isDefault: false }))
        updatePincode(formData.pincode)
      }

      if (editId) {
        addresses = addresses.map(a => a.id === parseInt(editId) ? newAddress : a)
      } else {
        addresses.push(newAddress)
      }

      localStorage.setItem('farmdirect-addresses', JSON.stringify(addresses))
      setLoading(false)
      navigate('/profile/address')
    }, 1000)
  }

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          to="/profile/address" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Addresses
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{editId ? 'Edit Address' : 'Add New Address'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 mb-6">
              {['Home', 'Work'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, type})}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.type === type 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flat, House no., Building, Company, Apartment</label>
              <input 
                required
                type="text" 
                value={formData.line1}
                onChange={(e) => setFormData({...formData, line1: e.target.value})}
                placeholder="e.g. Flat 402, Green Heights"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area, Street, Sector, Village</label>
              <input 
                required
                type="text" 
                value={formData.line2}
                onChange={(e) => setFormData({...formData, line2: e.target.value})}
                placeholder="e.g. Sector 12, Kharghar"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Landmark (Optional)</label>
              <input 
                type="text" 
                value={formData.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                placeholder="e.g. Near City Hospital"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pincode</label>
                <input 
                  required
                  type="text" 
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  placeholder="6 digit pincode"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Town / City</label>
                <div className="relative">
                  <input 
                    required
                    readOnly
                    type="text" 
                    value={formData.city}
                    placeholder="Enter pincode first"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" 
                  />
                  {autofilling && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 animate-spin" size={18} />}
                  {!autofilling && formData.city && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
              <input 
                required
                readOnly
                type="text" 
                value={formData.state}
                placeholder="Enter pincode first"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" 
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative h-6 w-6">
                <input 
                  type="checkbox" 
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="peer appearance-none h-6 w-6 rounded-lg border-2 border-slate-200 dark:border-slate-800 checked:bg-emerald-500 checked:border-emerald-500 transition-all"
                />
                <CheckCircle2 className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">Set as default address</span>
            </label>

            <button 
              disabled={loading}
              type="submit"
              className="w-full mt-4 py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                editId ? 'Update Address' : 'Add to Address Book'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
