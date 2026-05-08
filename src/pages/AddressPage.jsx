import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, Plus, MapPin, Edit2, Trash2, CheckCircle2 } from 'lucide-react'

export default function AddressPage() {
  const navigate = useNavigate()
  const { updatePincode } = useUser()
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('farmdirect-addresses')
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'Home', name: 'Your Name', address: '123 Green Valley, Nashik Road', city: 'Nashik', state: 'Maharashtra', pincode: '422001', isDefault: true },
      { id: 2, type: 'Work', name: 'Your Name', address: 'Office 404, Tech Park, Shivajinagar', city: 'Pune', state: 'Maharashtra', pincode: '411005', isDefault: false },
    ]
  })

  useEffect(() => {
    localStorage.setItem('farmdirect-addresses', JSON.stringify(addresses))
  }, [addresses])

  const handleRemove = (id) => {
    if (confirm('Are you sure you want to remove this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id))
    }
  }

  const handleSetDefault = (id) => {
    setAddresses(prev => {
      const updated = prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
      const selected = updated.find(a => a.id === id)
      if (selected) {
        updatePincode(selected.pincode)
      }
      return updated
    })
  }

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          to="/Account/User" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Account
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Addresses</h1>
          <Link 
            to="/profile/address/add"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add New
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border p-8 shadow-sm relative transition-all ${
              addr.isDefault ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  addr.type === 'Home' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {addr.type}
                </span>
                {addr.isDefault ? (
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Default
                  </span>
                ) : (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-wider transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{addr.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {addr.address},<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
                <Link 
                  to={`/profile/address/add?edit=${addr.id}`}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </Link>
                <button 
                  onClick={() => handleRemove(addr.id)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
