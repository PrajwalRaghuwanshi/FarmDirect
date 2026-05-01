import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
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
      </div>
    </div>
  )
}
