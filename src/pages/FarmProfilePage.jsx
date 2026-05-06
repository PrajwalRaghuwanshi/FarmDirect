import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Sprout, Droplets, Sun, Wind, ChevronLeft, ArrowRight, ShieldCheck, Award, MessageCircle, Tractor } from 'lucide-react'

export default function FarmProfilePage() {
  const { farmerName } = useParams()
  
  // Dummy data for the farm
  const farmData = {
    name: `${farmerName || 'Green'} Valley Farm`,
    owner: farmerName || 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    founded: '1985',
    area: '15 Acres',
    yield: '450 Tons/Year',
    soil: 'Rich Black Regur Soil',
    waterSource: 'Borewell & Rainwater Harvesting',
    techniques: ['Drip Irrigation', 'Organic Mulching', 'Natural Pest Control'],
    starProducts: [
      { name: 'Alphonso Mangoes', season: 'Summer', rating: 4.9, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80' },
      { name: 'Organic Tomatoes', season: 'Winter', rating: 4.8, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80' },
      { name: 'Fresh Spinach', season: 'Monsoon', rating: 4.7, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80'
    ]
  }

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 min-h-screen transition-colors">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={farmData.images[0]} 
          alt="Farm Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link 
              to="/farmers" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Back to Farmers</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                    Active Farm
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    Certified Organic
                  </span>
                </div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight">{farmData.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-white/70">
                  <MapPin size={18} />
                  <span>{farmData.location}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
                  <MessageCircle size={18} className="text-emerald-600" />
                  Chat with Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Farm Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Calendar, label: 'Founded', value: farmData.founded, color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Sprout, label: 'Total Area', value: farmData.area, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { icon: ShieldCheck, label: 'Annual Yield', value: farmData.yield, color: 'text-purple-500', bg: 'bg-purple-50' },
                { icon: Award, label: 'Rating', value: '4.9/5.0', color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${stat.bg} dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4`}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h2>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Tractor size={120} className="text-emerald-600" />
                </div>
                <div className="relative z-10 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Started by {farmData.owner}'s grandfather, {farmData.name} has been a staple of the {farmData.location} agricultural community for over three decades. 
                    What began as a small family plot has grown into a model for sustainable, organic farming in the region.
                  </p>
                  <p>
                    We believe that the best produce comes from soil that is loved and respected. That's why we never use synthetic fertilizers or pesticides, 
                    relying instead on ancestral wisdom combined with modern sustainable technology.
                  </p>
                </div>
              </div>
            </section>

            {/* Farm Specifications */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Farm Specifications</h2>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Land & Soil</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Total Area</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmData.area}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Soil Type</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmData.soil}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Elevation</span>
                        <span className="text-slate-900 dark:text-white font-semibold">560m ASL</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-8">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Production</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Annual Yield</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmData.yield}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Water Source</span>
                        <span className="text-slate-900 dark:text-white font-semibold">Natural Springs</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Organic Since</span>
                        <span className="text-slate-900 dark:text-white font-semibold">2005</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Previous Star Products */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Previous Star Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {farmData.starProducts.map((product) => (
                  <div key={product.name} className="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-40 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                          <Award size={12} />
                          {product.rating}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Best in {product.season}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Techniques Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Farming Techniques</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Water Management', desc: 'Advanced drip irrigation and rainwater harvesting systems.', icon: Droplets, color: 'text-blue-500' },
                  { title: 'Natural Nutrients', desc: 'Using composting and green manure to enrich the soil naturally.', icon: Sun, color: 'text-amber-500' },
                  { title: 'Eco Protection', desc: 'Intercropping and beneficial insects for pest management.', icon: Wind, color: 'text-emerald-500' }
                ].map((item) => (
                  <div key={item.title} className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
                    <item.icon className={`${item.color} mb-4`} size={28} />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Gallery */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Farm Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {farmData.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt="Farm" className="w-full h-32 object-cover rounded-2xl hover:scale-105 transition-transform" />
                ))}
                <div className="relative group cursor-pointer overflow-hidden rounded-2xl h-32">
                  <img src={farmData.images[0]} alt="Farm" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white font-bold text-sm">
                    +5 More
                  </div>
                </div>
              </div>
            </div>

            {/* Current Crops */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sprout className="text-emerald-400" />
                Current Harvest
              </h3>
              <ul className="space-y-4">
                {['Organic Alphonso Mangoes', 'Sweet Baby Potatoes', 'Fresh Spinach', 'Red Cherry Tomatoes'].map((item) => (
                  <li key={item} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">{item}</span>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </li>
                ))}
              </ul>
              <button className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                Shop from this Farm
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
