import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { CheckCircle2, ShoppingCart, AlertCircle } from 'lucide-react'
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
          src="/oil_painted_farm_landscape_1778488573940.png"
          alt="Farm Background"
          className="w-full h-full object-cover"
          style={{ animation: 'bgBlend 25s infinite alternate ease-in-out' }}
        />
      </div>
      <style>{`
        @keyframes bgBlend {
          0% { transform: scale(1); opacity: 0.3; filter: grayscale(0%); }
          100% { transform: scale(1.1); opacity: 0.5; filter: grayscale(0%); }
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
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl p-1.5 pl-4 text-sm font-medium shadow-2xl animate-in slide-in-from-bottom-5 fade-in border border-white/10 backdrop-blur-md ${
          toast.type === 'error' 
            ? 'bg-rose-900/95 text-rose-50' 
            : 'bg-slate-900/95 text-white dark:bg-emerald-900/95 dark:text-emerald-50'
        }`}>
          <div className="flex items-center gap-3 py-2">
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-400" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400" />
            )}
            {toast.message}
          </div>
          {toast.type !== 'error' && (
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              <ShoppingCart size={14} />
              View Cart
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
