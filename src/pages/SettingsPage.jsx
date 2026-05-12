import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Save, User, Bell, Shield, Globe, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'
import OtpVerificationModal from '../components/OtpVerificationModal'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'brx', name: 'बर (Bodo)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ks', name: 'کأشُر (Kashmiri)' },
  { code: 'kok', name: 'कोंकणी (Konkani)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mni', name: 'ꯃꯩꯇꯩꯂꯣꯟ (Manipuri)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'sa', name: 'संस्कृत (Sanskrit)' },
  { code: 'sat', name: 'संथाली (Santali)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ur', name: 'اردو (Urdu)' }
]

export default function SettingsPage() {
  const { user, updateUser } = useUser()
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    pincode: user?.pincode || '',
    city: user?.city || '',
    state: user?.state || '',
    languagepreference: user?.languagepreference || i18n.language || 'en',
    profileImage: null // To store the File object
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [message, setMessage] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        pincode: user.pincode || '',
        city: user.city || '',
        state: user.state || '',
        languagepreference: user.languagepreference || i18n.language || 'en',
        profileImage: null
      })
    }
  }, [user, i18n.language])

  // Auto-lookup city/state when pincode changes
  useEffect(() => {
    const lookupPincode = async () => {
      if (formData.pincode.length === 6) {
        setIsLookingUp(true)
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
          console.error("Pincode lookup failed:", err)
        } finally {
          setIsLookingUp(false)
        }
      }
    }
    lookupPincode()
  }, [formData.pincode])

  const handleSave = () => {
    setMessage('')
    setShowOtpModal(true)
  }

  const handleVerifyOtp = async (otp) => {
    setIsSaving(true)
    const updated = await updateUser(formData)
    if (updated) {
       if (formData.languagepreference !== i18n.language) {
         i18n.changeLanguage(formData.languagepreference)
       }
       setMessage('Profile updated successfully!')
       setShowOtpModal(false)
    } else {
       setMessage('Failed to update profile.')
    }
    setIsSaving(false)
  }

  const handleLanguageChange = (code) => {
    setFormData({ ...formData, languagepreference: code })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }))
    }
  }
  
  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Link 
          to={`/Account/${user?.name?.replace(/\s+/g, '') || 'missing'}`} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Account
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 space-y-1">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'language', label: 'Language', icon: Globe }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
                  
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-50 dark:border-slate-800">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                        {formData.profileImage ? (
                          <img src={URL.createObjectURL(formData.profileImage)} alt="Preview" className="h-full w-full object-cover" />
                        ) : user?.profileImage ? (
                          <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-emerald-700 transition-all active:scale-90">
                        <Save size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Picture</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                      <input type="text" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pincode</label>
                      <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City / District</label>
                      <div className="relative">
                        <input type="text" readOnly value={formData.city} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-500 outline-none cursor-not-allowed" />
                        {isLookingUp && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-600" size={16} />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                      <input type="text" readOnly value={formData.state} className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-500 outline-none cursor-not-allowed" />
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {message && <p className={`mt-4 text-sm font-medium ${message.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>{message}</p>}
                </div>
              )}
              
              {activeTab === 'language' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Language Preference</h2>
                    <p className="text-sm text-slate-500 mt-1">Select your preferred language for the entire platform.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                          formData.languagepreference === lang.code
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-emerald-200'
                        }`}
                      >
                        {lang.name}
                        {formData.languagepreference === lang.code && (
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => handleVerifyOtp()} // Skip OTP modal for language
                      disabled={isSaving} 
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-70"
                    >
                      <Save size={18} />
                      {isSaving ? 'Saving...' : 'Apply Language Change'}
                    </button>
                    {message && <p className={`mt-4 text-sm font-medium ${message.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>{message}</p>}
                  </div>
                </div>
              )}

              {activeTab !== 'personal' && activeTab !== 'language' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Globe className="text-slate-300 animate-spin-slow" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Coming Soon</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-2">We're working hard to bring you more control over your account settings.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      <OtpVerificationModal 
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        mobileNumber={formData.mobile}
        loading={isSaving}
      />
    </div>
  )
}
