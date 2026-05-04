import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Save, User, Bell, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal')
  
  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Link 
          to="/Account/User" 
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input type="text" defaultValue="Prajwal Raghuwanshi" className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input type="email" defaultValue="prajwal@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                      <input type="text" defaultValue="+91 9876543210" className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              )}
              
              {activeTab !== 'personal' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Settings className="text-slate-300 animate-spin-slow" size={32} />
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
    </div>
  )
}
