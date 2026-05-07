import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import Footer from './Footer'
import Header from './Header'
import WelcomeModal from './WelcomeModal'

export default function Layout() {
  const { toast } = useCart()
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 relative">
      {/* Global Background Image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80" 
          alt="Farm Background" 
          className="w-full h-full object-cover"
          style={{ animation: 'bgBlend 25s infinite alternate ease-in-out' }}
        />
      </div>
      <style>{`
        @keyframes bgBlend {
          0% { transform: scale(1); opacity: 0.03; filter: grayscale(20%); }
          100% { transform: scale(1.1); opacity: 0.15; filter: grayscale(0%); }
        }
      `}</style>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WelcomeModal />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl bg-slate-900/95 backdrop-blur-md p-1.5 pl-4 text-sm font-medium text-white shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-5 fade-in dark:bg-emerald-900/95 dark:text-emerald-50 border border-white/10">
          <div className="flex items-center gap-3 py-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            {toast.message}
          </div>
          <Link 
            to="/cart"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <ShoppingCart size={14} />
            View Cart
          </Link>
        </div>
      )}
    </div>
  )
}
