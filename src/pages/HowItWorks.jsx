import { ShoppingBasket, Tractor, Truck, Heart, Sprout, ShieldCheck, Sun } from 'lucide-react';

export default function HowItWorksPage() {
    const steps = [
        {
            id: 1,
            title: 'You Browse & Order',
            description: 'Explore a wide variety of fresh, seasonal produce listed directly by local farmers.',
            icon: ShoppingBasket,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            id: 2,
            title: 'Farmers Harvest',
            description: 'Once you place an order, farmers get to work, picking the freshest items right from the soil.',
            icon: Tractor,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-900/30'
        },
        {
            id: 3,
            title: 'Direct Delivery',
            description: 'Your order is transported quickly from the farm to your doorstep, minimizing transit time.',
            icon: Truck,
            color: 'text-green-500',
            bg: 'bg-green-100 dark:bg-green-900/30'
        }
    ];

    const benefits = [
        { title: 'Fair Compensation', description: 'Farmers keep a significantly larger share of the profits compared to traditional supermarkets.', icon: Heart },
        { title: 'Sustainable Practices', description: 'By supporting local farms, you encourage sustainable agriculture and lower carbon footprints.', icon: Sprout },
        { title: 'Guaranteed Freshness', description: 'Produce is harvested to order, meaning it spends less time on shelves and more time staying fresh.', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-24 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-900/10 dark:to-amber-900/10" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-6">
                        <Sun className="h-4 w-4" /> Farm to Table Simplified
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">FarmDirect</span> Works
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        We're revolutionizing the way you buy food by completely cutting out the middlemen. Experience true freshness, fair prices, and total transparency.
                    </p>
                </div>
            </div>

            {/* Steps Section */}
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative group">
                            {/* Connector Line (hidden on small screens) */}
                            {index !== steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-slate-200 dark:bg-slate-800" />
                            )}
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`flex h-24 w-24 items-center justify-center rounded-3xl ${step.bg} mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    <step.icon className={`h-12 w-12 ${step.color}`} strokeWidth={1.5} />
                                </div>
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm mb-4 dark:bg-white dark:text-slate-900">
                                    {step.id}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Farmers Feature Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl bg-emerald-900 dark:bg-slate-900 border border-emerald-800 dark:border-slate-800 shadow-2xl relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696650-6f02279b94ce?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent dark:from-slate-950 dark:via-slate-900/80"></div>
                    
                    <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:flex lg:items-center lg:justify-between lg:px-20">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Empowering Our Farmers
                            </h2>
                            <p className="mt-4 text-lg text-emerald-100 dark:text-slate-300 leading-relaxed max-w-2xl">
                                At the heart of our platform are the hard-working farmers who dedicate their lives to cultivating the land. 
                                By removing supermarkets and wholesale distributors from the equation, we ensure that the people who grow our food are the ones who benefit the most.
                            </p>
                            
                            <div className="mt-8 space-y-6">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/50">
                                                <benefit.icon className="h-5 w-5 text-emerald-300" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">{benefit.title}</h4>
                                            <p className="mt-1 text-emerald-100/80 dark:text-slate-400 text-sm">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-12 lg:mt-0 lg:w-5/12">
                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-8 border border-white/20 shadow-xl relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-4">Did You Know?</h3>
                                <p className="text-emerald-50 dark:text-slate-200 text-lg italic">
                                    "On average, traditional supply chains return less than 15 cents of every dollar back to the farmer. Through FarmDirect, our farmers keep over 85% of every transaction."
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-emerald-700 overflow-hidden border-2 border-emerald-400">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" alt="Farmer Avatar" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">David R.</div>
                                        <div className="text-emerald-300 text-sm">Orchard Farmer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
