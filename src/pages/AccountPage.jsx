import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserRound, Phone, Mail, Package, Settings, MapPin, FileText, History, LogOut, ChevronRight, Edit2, Activity, Star, Heart, Cloud, HandHeart, Check, X as CloseIcon, Headset } from 'lucide-react'
import { useUser } from '../context/UserContext'
import ProfileUpdateModal from '../components/ProfileUpdateModal'
import { useTranslation } from 'react-i18next'

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80', position: 'object-right-top' },
  { src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', position: 'object-center' }
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { username } = useParams()
  const { user, login, logout, updateUser, pincode } = useUser()
  const { t } = useTranslation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [updateModal, setUpdateModal] = useState({ isOpen: false, type: 'mobile' })
  const [defaultAddress, setDefaultAddress] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    // Load default address or user location
    const saved = localStorage.getItem('farmdirect-addresses')
    if (saved) {
      try {
        const addresses = JSON.parse(saved)
        const def = addresses.find(a => a.isDefault) || addresses[0]
        if (def) {
          setDefaultAddress(`${def.address}, ${def.city}`)
        }
      } catch (e) {
        console.error('Failed to parse addresses', e)
      }
    } else if (user?.pincode) {
      // Fallback to user document pincode/city if no address list
      const locationParts = [user.city, user.state, user.pincode].filter(Boolean)
      if (locationParts.length > 0) {
        setDefaultAddress(locationParts.join(', '))
      }
    }

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!user) {
      const stored = window.localStorage.getItem('farmdirect-user')
      if (!stored) {
        navigate('/signin')
      }
    }
  }, [user, navigate])

  if (!user) return null

  function handleLogout() {
    logout()
    navigate('/')
  }

  const handleProfileUpdate = async (newValue) => {
    const updatedUser = await updateUser({ [updateModal.type]: newValue })
    if (!updatedUser) {
       alert("Failed to update profile details.")
    }
  }

  const menuItems = [
    { icon: Package, titleKey: 'yourOrders', titleFallback: 'Your Orders', descKey: 'trackReturnBuy', descFallback: 'Track, return, or buy things again', path: '/orders' },
    { icon: Settings, titleKey: 'accountSettings', titleFallback: 'Account Settings', descKey: 'manageCustomInfo', descFallback: 'Manage your profile and custom settings', path: '/profile/settings' },
    { icon: History, titleKey: 'recentlyViewed', titleFallback: 'Recently Viewed', descKey: 'checkWhatViewed', descFallback: 'Check what you viewed recently', path: '/profile/recently-viewed' },
    { icon: Activity, titleKey: 'myActivity', titleFallback: 'My Activity', descKey: 'reviewsWishlistImpact', descFallback: 'Reviews, Wishlist, and Impact', path: '/profile/activity' },
    { icon: Headset, titleKey: 'customerService', titleFallback: 'Customer Service', descKey: 'helpSupportDesc', descFallback: 'Get help and support', path: '/support' },
  ]

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 transition-colors overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 w-full h-full bg-emerald-900 z-0">
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={`Farm landscape ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover ${image.position} transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-0"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('hello')}, {user.name}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{t('manageProfile')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 dark:hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            {t('signOut')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group mb-4">
                  <div className="h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={40} strokeWidth={1.5} />
                    )}
                  </div>
                  <button onClick={() => navigate('/profile/settings')} className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105 z-10" title="Account Settings">
                    <Settings size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">{t('premiumMember')}</p>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('mobileNumber')}</p>
                    <div className="flex items-center justify-between group/mob">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">+91 {user.mobile}</p>
                      <button 
                        onClick={() => setUpdateModal({ isOpen: true, type: 'mobile' })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 opacity-0 group-hover/mob:opacity-100 transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('emailAddress')}</p>
                    <div className="flex items-center justify-between group/email">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{user.email || t('notAddedYet')}</p>
                      <button 
                        onClick={() => setUpdateModal({ isOpen: true, type: 'email' })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 opacity-0 group-hover/email:opacity-100 transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('pincode', 'Pincode')}</p>
                    <div className="flex items-center justify-between group/pin">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{user.pincode || t('notAddedYet', 'Not added yet')}</p>
                      <button 
                        onClick={() => navigate('/profile/settings')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 opacity-0 group-hover/pin:opacity-100 transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/profile/address')}
                  className="flex items-start gap-3 w-full text-left group/addr hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -ml-2 rounded-xl transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 group-hover/addr:bg-emerald-50 dark:group-hover/addr:bg-emerald-900/30 group-hover/addr:text-emerald-600 transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('yourAddress')}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {defaultAddress || (user.pincode ? `${user.city || ''} ${user.pincode}`.trim() : t('noAddressAdded'))}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 self-center group-hover/addr:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.path.startsWith('#')) {
                        const el = document.querySelector(item.path)
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      } else {
                        navigate(item.path)
                      }
                    }}
                    className="flex flex-col items-start p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-left"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t(item.titleKey, item.titleFallback)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t(item.descKey, item.descFallback)}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
      <ProfileUpdateModal
        isOpen={updateModal.isOpen}
        onClose={() => setUpdateModal({ ...updateModal, isOpen: false })}
        type={updateModal.type}
        currentValue={user[updateModal.type]}
        onUpdate={handleProfileUpdate}
      />
    </div>
  )
}
