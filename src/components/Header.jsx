import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { Search, ShoppingCart, User, Leaf, Sun, Moon, ChevronDown, Apple, Carrot, Wheat, Factory, UserRound, Package } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products', hasDropdown: true },
  { label: 'Farmers', to: '/farmers' },
  { label: 'How It Works', to: '/how-it-works' },
]

const shopCategories = [
  {
    heading: 'Grains & Pulses',
    icon: Wheat,
    items: ['Basmati Rice', 'Toor Dal', 'Moong Dal', 'Organic Millets'],
    category: 'Grains & Pulses',
  },
  {
    heading: 'Fruits',
    icon: Apple,
    items: ['Alphonso Mangoes', 'Red Apples', 'Seasonal Fruits', 'Citrus Fruits'],
    category: 'Fruits',
  },
  {
    heading: 'Vegetables',
    icon: Carrot,
    items: ['Fresh Tomatoes', 'Baby Potatoes', 'Organic Spinach', 'Organic Carrots'],
    category: 'Vegetables',
  },
  {
    heading: 'Commercial Crops',
    icon: Factory,
    items: ['Jute', 'Cotton', 'Sugarcane', 'Tobacco'],
    category: 'Commercial Crops',
  },
]

export default function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('farmdirect-user')
      setUser(stored ? JSON.parse(stored) : null)
    }
  }, [location.pathname])

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const storedTheme = window.localStorage.getItem('harvest-hub-theme')
    return storedTheme === 'dark' || (!storedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const shopMenuRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    function handleClickOutside(e) {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopMenuOpen(false)
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

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
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {shopMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[760px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 z-50 animate-in fade-in">
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700"></div>

                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Shop by Category</h3>
                      <button
                        onClick={() => { setShopMenuOpen(false); navigate('/products'); }}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                      >
                        View All Products →
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      {shopCategories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <div key={cat.heading}>
                            <button
                              onClick={() => goToCategory(cat.category)}
                              className="flex items-center gap-2 mb-3 group/cat"
                            >
                              <Icon size={18} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                              <span className="whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white group-hover/cat:text-emerald-600 dark:group-hover/cat:text-emerald-400 transition">
                                {cat.heading}
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
                                  All {cat.heading} →
                                </button>
                              </li>
                            </ul>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <button onClick={() => { setShopMenuOpen(false); navigate('/products'); }} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        🛒 All Items
                      </button>
                      <button onClick={() => goToCategory('Commercial Crops')} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        🏭 Commercial Crops
                      </button>
                      <button onClick={() => { setShopMenuOpen(false); navigate('/seasons'); }} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        ⭐ Season's Best
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
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right Section: Search, Cart, User */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex relative text-slate-400 dark:text-slate-500 focus-within:text-emerald-600 dark:focus-within:text-emerald-400">
            <input
              type="text"
              placeholder="Search for products, farmers..."
              className="pl-4 pr-10 py-2 w-64 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400" />
          </div>

          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              {isDarkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>
            <NavLink 
              to="/orders" 
              className={`relative transition flex items-center ${
                location.pathname === '/orders'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
              title="Order History"
            >
              <Package size={24} strokeWidth={2} className={location.pathname === '/orders' ? 'fill-emerald-50 dark:fill-emerald-900/50' : ''} />
            </NavLink>
            <NavLink 
              to="/cart" 
              className={`relative transition flex items-center ${
                location.pathname === '/cart'
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

            {user ? (
              <button 
                onClick={() => navigate(`/Account/${user?.name?.replace(/\\s+/g, '') || 'User'}`)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <UserRound size={18} strokeWidth={2} />
                </div>
                <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'User'}</span>
              </button>
            ) : (
              <NavLink to="/signin" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                <User size={20} strokeWidth={2} />
                <span className="hidden sm:inline">Sign In</span>
              </NavLink>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}
