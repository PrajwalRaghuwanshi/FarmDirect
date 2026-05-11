import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { ChevronLeft, Plus, MapPin, Edit2, Trash2, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'

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
  const [showConfirm, setShowConfirm] = useState(null) // holds ID to remove
  const [notification, setNotification] = useState(null) // { title, message, type }

  useEffect(() => {
    localStorage.setItem('farmdirect-addresses', JSON.stringify(addresses))
  }, [addresses])

  const handleRemove = (id) => {
    setShowConfirm(id)
  }

  const confirmRemove = () => {
    const idToRemove = showConfirm
    setAddresses(prev => prev.filter(addr => String(addr.id) !== String(idToRemove)))
    setShowConfirm(null)
    setNotification({
      title: 'Address Removed',
      message: 'The address has been successfully removed from your account.',
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
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

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remove Address?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRemove}
                  className="flex-1 py-3.5 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Popup */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">{notification.title}</p>
              <p className="text-[11px] text-slate-400">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
