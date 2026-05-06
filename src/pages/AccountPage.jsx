import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserRound, Phone, Mail, Package, Settings, MapPin, FileText, History, LogOut, ChevronRight, Edit2 } from 'lucide-react'

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80', position: 'object-right-top' },
  { src: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80', position: 'object-center' },
  { src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', position: 'object-center' }
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stored = window.localStorage.getItem('farmdirect-user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      navigate('/signin')
    }
  }, [navigate])

  if (!user) return null

  function handleLogout() {
    window.localStorage.removeItem('farmdirect-user')
    navigate('/')
  }

  const menuItems = [
    { icon: Package, title: 'Your Orders', desc: 'Track, return, or buy things again', path: '/orders' },
    { icon: Settings, title: 'Account Settings', desc: 'Edit password, email, and preferences', path: '/profile/settings' },
    { icon: FileText, title: 'Photo ID Proof', desc: 'Manage your verified documents', path: '/profile/id-proof' },
    { icon: History, title: 'Recently Viewed', desc: 'Check what you were looking at', path: '/profile/recently-viewed' },
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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hello, {user.name}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your profile, orders, and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 dark:hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center mb-4 relative group">
                  <UserRound size={40} strokeWidth={1.5} />
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105">
                    <Edit2 size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">Premium Member</p>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mobile Number</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">+91 {user.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{user.email || 'Not added yet'}</p>
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
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Address</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 line-clamp-1">{user.address || 'Click to manage addresses'}</p>
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
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-start p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-left"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
