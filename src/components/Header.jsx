import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useUser } from '../context/UserContext'
import { Search, ShoppingCart, User, Leaf, Sun, Moon, ChevronDown, Apple, Carrot, Wheat, Factory, UserRound, Package, Bell, Menu, X, Heart } from 'lucide-react'

const navItems = [
  { label: 'Home', translationKey: 'home', to: '/' },
  { label: 'Store', translationKey: 'store', to: '/products', hasDropdown: true },
  { label: "Season's Best", translationKey: "seasonBest", to: '/seasons' },
  { label: 'Farmers', translationKey: "farmers", to: '/farmers' },
  { label: 'How It Works', translationKey: "howItWorks", to: '/how-it-works' },
]

const shopCategories = [
  {
    translationKey: 'grainsPulses',
    icon: Wheat,
    items: ['Basmati Rice', 'Toor Dal', 'Moong Dal', 'Organic Millets'],
    category: 'Grains & Pulses',
  },
  {
    translationKey: 'fruits',
    icon: Apple,
    items: ['Alphonso Mangoes', 'Red Apples', 'Seasonal Fruits', 'Citrus Fruits'],
    category: 'Fruits',
  },
  {
    translationKey: 'vegetables',
    icon: Carrot,
    items: ['Fresh Tomatoes', 'Baby Potatoes', 'Organic Spinach', 'Organic Carrots'],
    category: 'Vegetables',
  },
  {
    translationKey: 'commercialCrops',
    icon: Factory,
    items: ['Jute', 'Cotton', 'Sugarcane', 'Tobacco'],
    category: 'Commercial Crops',
  },
]

const INITIAL_NOTIFICATIONS = [
  { id: 1, name: 'Farmer Ramesh', message: 'Your order of Alphonso Mangoes is ready!', time: '2m ago', unread: true, avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 2, name: 'Green Valley Farm', message: 'We have fresh tomatoes today.', time: '1h ago', unread: false, avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 3, name: 'Support', message: 'How can we help you today?', time: '3h ago', unread: false, avatar: 'https://i.pravatar.cc/100?img=3' },
]

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'हि' },
  { code: 'bn', label: 'বাংলা', short: 'বা' },
  { code: 'ta', label: 'தமிழ்', short: 'த' },
  { code: 'te', label: 'తెలుగు', short: 'తె' },
  { code: 'kn', label: 'ಕನ್ನಡ', short: 'ಕ' },
  { code: 'ml', label: 'മലയാളം', short: 'മ' },
  { code: 'mr', label: 'मराठी', short: 'म' },
  { code: 'gu', label: 'ગુજરાતી', short: 'ગુ' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'ਪੰ' },
  { code: 'or', label: 'ଓଡ଼ିଆ', short: 'ଓ' },
  { code: 'as', label: 'অসমীয়া', short: 'অ' },
  { code: 'ur', label: 'اردو', short: 'ار' },
  { code: 'sa', label: 'संस्कृतम्', short: 'सं' },
  { code: 'ne', label: 'नेपाली', short: 'ने' },
  { code: 'ks', label: 'کٲشُر', short: 'ک' },
  { code: 'kok', label: 'कोंकणी', short: 'को' },
  { code: 'mai', label: 'मैथिली', short: 'मै' },
  { code: 'mni', label: 'ꯃꯩꯇꯩꯂꯣꯟ', short: 'ꯃ' },
  { code: 'doi', label: 'डोगरी', short: 'डो' },
  { code: 'brx', label: 'बड़ो', short: 'ब' },
  { code: 'sat', label: 'संताली', short: 'सं' },
  { code: 'sd', label: 'सिंधी', short: 'सि' },
];

export default function Header() {

  const { t, i18n } = useTranslation();
  const { itemCount } = useCart()
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const storedTheme = window.localStorage.getItem('harvest-hub-theme')
    return storedTheme === 'dark' || (!storedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const shopMenuRef = useRef(null)
  const messagesRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    function handleClickOutside(e) {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopMenuOpen(false)
      }
      if (messagesRef.current && !messagesRef.current.contains(e.target)) {
        setMessagesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleTheme() {
    const nextDarkMode = !isDarkMode
    setIsDarkMode(nextDarkMode)
    document.documentElement.classList.toggle('dark', nextDarkMode)
    window.localStorage.setItem('harvest-hub-theme', nextDarkMode ? 'dark' : 'light')
  }

  function goToCategory(category) {
    setShopMenuOpen(false)
    navigate(`/products?category=${encodeURIComponent(category)}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-sm transition-colors">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo Area */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="text-emerald-600">
            <Leaf size={32} strokeWidth={2} className="fill-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
              FarmDirect
            </h1>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
              From Farm. To You.
            </p>
          </div>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          {navItems.map((item) => (
            item.hasDropdown ? (
              <div key={item.to} className="relative" ref={shopMenuRef}>
                <button
                  type="button"
                  onClick={() => setShopMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-1 pb-1 transition border-b-2 ${shopMenuOpen
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                >
                  {t(item.translationKey)}
                  <ChevronDown size={14} className={`transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {shopMenuOpen && (
                  <div className="absolute left-[-250px] top-full mt-4 w-[760px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 z-50 animate-in fade-in">
                    {/* Arrow */}
                    <div className="absolute -top-2 left-[265px] w-4 h-4 rotate-45 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700"></div>

                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{t("storeByCategory")}</h3>
                      <button
                        onClick={() => { setShopMenuOpen(false); navigate('/products'); }}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                      >
                        {t("viewAllProducts")}
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      {shopCategories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <div key={cat.translationKey}>
                            <button
                              onClick={() => goToCategory(cat.category)}
                              className="flex items-center gap-2 mb-3 group/cat"
                            >
                              <Icon size={18} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                              <span className="whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white group-hover/cat:text-emerald-600 dark:group-hover/cat:text-emerald-400 transition">
                                {t(cat.translationKey)}
                              </span>
                            </button>
                            <ul className="space-y-2">
                              {cat.items.map((subItem) => (
                                <li key={subItem}>
                                  <button
                                    onClick={() => goToCategory(cat.category)}
                                    className="text-[13px] text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition w-full text-left"
                                  >
                                    {subItem}
                                  </button>
                                </li>
                              ))}
                              <li>
                                <button
                                  onClick={() => goToCategory(cat.category)}
                                  className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                                >
                                  {t('all')} {t(cat.translationKey)} →
                                </button>
                              </li>
                            </ul>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                      <button onClick={() => { setShopMenuOpen(false); navigate('/products'); }} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        🛒 {t("allItems")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `pb-1 transition border-b-2 ${isActive && !shopMenuOpen
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`
                }
              >
                {t(item.translationKey)}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right Section: Search, Cart, User */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex relative text-slate-400 dark:text-slate-500 focus-within:text-emerald-600 dark:focus-within:text-emerald-400">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="pl-4 pr-10 py-2 w-64 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400" />
          </div>


          <div className="flex items-center gap-5">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="hidden lg:flex text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                {isDarkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>
            {/* Desktop Language Selector */}
            <div className="relative hidden lg:flex ml-4">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition min-w-[60px] justify-center"
                aria-haspopup="true"
                aria-expanded={languageMenuOpen}
              >
                {languages.find(l => l.code === i18n.language)?.short || 'EN'}
                <ChevronDown className={`w-4 h-4 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Select Language</p>
                  </div>
                  <ul className="max-h-80 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            localStorage.setItem('i18nextLng', lang.code);
                            setLanguageMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                            i18n.language === lang.code
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{lang.label}</span>
                          {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <NavLink
              to="/cart"
              className={`relative transition flex items-center ${location.pathname === '/cart'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
              <ShoppingCart size={24} strokeWidth={2} className={location.pathname === '/cart' ? 'fill-emerald-50 dark:fill-emerald-900/50' : ''} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>

            <div className="hidden lg:block relative" ref={messagesRef}>
              <button
                onClick={() => setMessagesOpen(!messagesOpen)}
                className={`relative transition flex items-center ${messagesOpen
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                title="Notifications"
              >
                <Bell size={24} strokeWidth={2} className={messagesOpen ? 'fill-emerald-50 dark:fill-emerald-900/50' : ''} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {messagesOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-emerald-600 p-4 text-white">
                    <h3 className="font-bold text-base">{t("notifications")}</h3>
                    <p className="text-xs text-emerald-100">You have {unreadCount} new {unreadCount === 1 ? 'notification' : 'notifications'}</p>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((msg) => (
                        <div
                          key={msg.id}
                          className="group/msg relative w-full flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          <div className="relative flex-shrink-0">
                            <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full object-cover" />
                            {msg.unread && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-slate-900 dark:text-white truncate pr-4">{msg.name}</span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{msg.time}</span>
                            </div>
                            <p className={`text-xs line-clamp-2 ${msg.unread ? 'text-slate-900 dark:text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                              {msg.message}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(msg.id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover/msg:opacity-100 transition-all duration-200"
                            title="Remove notification"
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3 opacity-20" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t("allCaughtUp")}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t("noNotifications")}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                    <button className="w-full py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition">
                      View All in WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>



            {user ? (
              <button
                onClick={() => navigate(`/Account/${user?.name?.replace(/\s+/g, '') || 'User'}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <UserRound size={16} strokeWidth={2.5} />
                </div>
                <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'User'}</span>
              </button>
            ) : (
              <NavLink to="/signin" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                <User size={18} strokeWidth={2.5} />
                <span className="hidden sm:inline">{t("signIn")}</span>
              </NavLink>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-50 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <div key={item.to} className="flex flex-col">
                <NavLink
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-bold py-2 transition ${isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                    }`
                  }
                >
                  {t(item.translationKey)}
                </NavLink>
                {item.hasDropdown && (
                  <div className="pl-4 mt-2 grid grid-cols-2 gap-4">
                    {shopCategories.map((cat) => (
                      <button
                        key={cat.heading}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          goToCategory(cat.category)
                        }}
                        className="text-left py-1 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600"
                      >
                        {cat.heading}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={toggleTheme} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="text-xs font-bold">{isDarkMode ? t("lightMode") : t("darkMode")}</span>
                </button>
                {/* Language Selector for Mobile */}
                <div className="col-span-2 relative mt-2">
                  <button
                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    aria-haspopup="true"
                    aria-expanded={languageMenuOpen}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Language:</span>
                      <span>{languages.find(l => l.code === i18n.language)?.label || 'English'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {languageMenuOpen && (
                    <div className="mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <ul className="max-h-60 overflow-y-auto py-1">
                        {languages.map((lang) => (
                          <li key={lang.code}>
                            <button
                              onClick={() => {
                                i18n.changeLanguage(lang.code);
                                localStorage.setItem('i18nextLng', lang.code);
                                setLanguageMenuOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                i18n.language === lang.code
                                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-bold'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {lang.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 relative">
                  <Bell size={20} />
                  <span className="text-xs font-bold">{t("alerts")}</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-3 right-8 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NavLink
                  to="/profile/activity"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Heart size={20} />
                  <span className="text-xs font-bold">{t("activity")}</span>
                </NavLink>
              </div>

              {!user && (
                <NavLink
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-white font-bold"
                >
                  <User size={20} />
                  Sign In
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
