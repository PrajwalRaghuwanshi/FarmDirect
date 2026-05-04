import { Link } from 'react-router-dom'
import { ChevronLeft, FileText, Upload, ShieldCheck, AlertCircle } from 'lucide-react'

export default function IDProofPage() {
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

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Photo ID Proof</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Identity Verification</h2>
                  <p className="text-sm text-slate-500">Verified accounts get access to bulk orders and farm visits.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer group">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
                  <Upload className="text-slate-400 group-hover:text-emerald-600 transition-colors" size={32} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Upload New Document</h3>
                <p className="text-sm text-slate-500 mt-2">Aadhar Card, PAN Card, or Driving License (Max 5MB)</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Submitted Documents</h3>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Aadhar_Front.jpg</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Verified</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">Mar 12, 2026</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-4">
                <AlertCircle size={20} />
                <h3 className="font-bold">Why verify?</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Access to exclusive farm-to-table events',
                  'Priority delivery on seasonal harvests',
                  'Verified buyer badge on community forums',
                  'Ability to pre-book commercial crops'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-amber-800/70 dark:text-amber-300/60 leading-relaxed">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
