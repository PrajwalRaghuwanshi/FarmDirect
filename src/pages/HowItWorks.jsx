import { Sun, ShieldCheck, Truck, Sprout, Globe, Heart, Target, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 selection:bg-green-100 selection:text-green-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-24 pb-32 border-b border-slate-100 dark:border-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.05),transparent_50%)]" />
                
                <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-8 border border-green-100 dark:border-green-800/50">
                        <Sun className="h-4 w-4 animate-pulse" /> {t('freshLocalSustainable')}
                    </span>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl mb-8 leading-tight">
                        {t('howItWorksTitleNew')}
                    </h1>
                    
                    <p className="mx-auto max-w-3xl text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {t('howItWorksIntro')}
                    </p>
                </div>
            </div>

            {/* Narrative Content */}
            <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="grid gap-24 lg:gap-32">
                    
                    {/* Block 1: The Process */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 mb-8">
                                <Sprout className="h-8 w-8" />
                            </div>
                            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                                {t('howItWorksBody1')}
                            </p>
                        </div>
                        <div className="order-1 md:order-2 relative group">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-2 animate-float transition-transform duration-700 group-hover:scale-105">
                                <img 
                                    src="/images/farm_harvest.png" 
                                    alt="Farming" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[240px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{t('qualityGuaranteed')}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t('qualityYouCanTrust')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Block 2: The Delivery */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl -rotate-2 animate-float-reverse transition-transform duration-700 group-hover:scale-105">
                                <img 
                                    src="/images/direct_delivery.png" 
                                    alt="Delivery" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[240px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{t('fastDelivery')}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t('toYourDoorstep')}</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-8">
                                <Truck className="h-8 w-8" />
                            </div>
                            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                                {t('howItWorksBody2')}
                            </p>
                        </div>
                    </div>

                    {/* Impact Transition */}
                    <div className="py-16 text-center border-y border-slate-100 dark:border-slate-900">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            {t('howItWorksMoreThanMarketplace')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center group">
                        <div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-8">
                                <Globe className="h-8 w-8" />
                            </div>
                            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                                {t('howItWorksBody3')}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="aspect-[4/5] rounded-2xl bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center p-6 text-center border border-green-100 dark:border-green-800/30">
                                    <Heart className="h-10 w-10 text-green-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 dark:text-white">{t('supportLocalFarmers')}</h4>
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 animate-float shadow-lg relative top-2">
                                    <img src="/images/sustainable_landscape.png" alt="Nature" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="aspect-square rounded-2xl overflow-hidden animate-float-reverse shadow-lg">
                                    <img src="/images/eco_sprout.png" alt="Eco" className="w-full h-full object-cover" />
                                </div>
                                <div className="aspect-[4/5] rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center p-6 text-center border border-amber-100 dark:border-amber-800/30">
                                    <ShieldCheck className="h-10 w-10 text-amber-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 dark:text-white">{t('safeAndTrusted')}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block 4: UX & Interface */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 flex justify-center">
                            <div className="relative w-full max-w-sm">
                                <div className="absolute inset-0 bg-green-200 dark:bg-green-800 blur-3xl opacity-20" />
                                <div className="relative rounded-3xl bg-slate-900 p-4 shadow-2xl border border-slate-800">
                                    <div className="aspect-[9/16] rounded-2xl bg-white dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                                        <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3" />
                                        <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8" />
                                        <div className="w-full space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-12 w-full rounded-xl border border-slate-100 dark:border-slate-800" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 mb-8">
                                <Target className="h-8 w-8" />
                            </div>
                            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                                {t('howItWorksBody4')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Call to Action / Footer */}
            <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="rounded-[3rem] bg-emerald-900 dark:bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-emerald-800 dark:border-slate-800">
                    <div className="absolute inset-0 bg-[url('/images/sustainable_landscape.png')] bg-cover bg-center opacity-10" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 max-w-3xl mx-auto leading-tight italic">
                            "{t('howItWorksFooter')}"
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/products" className="px-10 py-5 bg-white text-emerald-900 font-black rounded-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl shadow-black/20">
                                {t('shopNow')} <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
