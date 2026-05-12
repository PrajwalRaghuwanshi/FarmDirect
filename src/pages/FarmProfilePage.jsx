import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Sprout, Droplets, Sun, Wind, ChevronLeft, ArrowRight, ShieldCheck, Award, MessageCircle, Tractor, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FarmProfilePage() {
  const { farmerName } = useParams()
  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
        // Fetch all and find (more robust for now if no specific ID endpoint)
        const res = await fetch(`${apiUrl}/api/farmers`);
        const data = await res.json();
        
        if (data.farmers) {
          const found = data.farmers.find(f => f.name === decodeURIComponent(farmerName))
          setFarmer(found)
        }
      } catch (err) {
        console.error("Failed to fetch farmer:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFarmerData()
  }, [farmerName])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  // Map DB data to UI data
  const farmData = {
    name: farmer?.farmName || `${farmer?.name || 'Local'} Farm`,
    owner: farmer?.name || 'Rajesh Kumar',
    location: [farmer?.district, farmer?.state].filter(Boolean).join(', ') || 'India',
    founded: farmer?.createdAt ? new Date(farmer.createdAt).getFullYear() : '2020',
    area: farmer?.farmSize ? `${farmer.farmSize} ${farmer.farmUnit || 'Acres'}` : 'N/A',
    yield: '450 Tons/Year', // Mock for now
    soil: 'Rich Local Soil',
    waterSource: farmer?.irrigationSource || 'Local Source',
    techniques: ['Sustainable Farming', 'Organic Mulching', 'Natural Pest Control'],
    bio: farmer?.bio || `Welcome to ${farmer?.farmName || 'our farm'}. We are dedicated to providing fresh, organic produce to our community.`,
    profilePhoto: farmer?.profilePhoto || '/oil_painted_farm_landscape_1778488573940.png',
    images: (farmer?.farmImages && farmer.farmImages.length > 0) ? farmer.farmImages : [
      '/oil_painted_farm_landscape_1778488573940.png',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
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
              <div className="flex items-center gap-6">
                <img 
                  src={farmData.profilePhoto} 
                  alt={farmData.owner}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-2xl backdrop-blur-sm"
                />
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                      Active Farm
                    </span>
                    {farmer?.isVerified && (
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        Certified Organic
                      </span>
                    )}
                  </div>
                  <h1 className="text-5xl font-extrabold text-white tracking-tight">{farmData.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-white/70">
                    <MapPin size={18} />
                    <span>{farmData.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
                  <MessageCircle size={18} className="text-emerald-600" />
                  Chat with {farmData.owner.split(' ')[0]}
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
                { icon: ShieldCheck, label: 'Water Source', value: farmData.waterSource, color: 'text-purple-500', bg: 'bg-purple-50' },
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
                  <p>{farmData.bio}</p>
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
                        <span className="text-slate-500 dark:text-slate-400 text-sm">District</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmer?.district || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-8">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Production</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Village</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmer?.villageLocality || 'N/A'}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Water Source</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmData.waterSource}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Ownership</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{farmer?.ownershipType || 'Private'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Techniques Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Farming Techniques</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Water Management', desc: `Utilizing ${farmer?.irrigationSource || 'natural'} systems for optimal hydration.`, icon: Droplets, color: 'text-blue-500' },
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
                {farmData.images.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="Farm" className="w-full h-32 object-cover rounded-2xl hover:scale-105 transition-transform" />
                ))}
                <div className="relative group cursor-pointer overflow-hidden rounded-2xl h-32">
                  <img src={farmData.images[0]} alt="Farm" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white font-bold text-sm">
                    View More
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
                {(farmer?.crops || ['Seasonal Fruits', 'Organic Vegetables']).map((item) => (
                  <li key={item} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">{item}</span>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </li>
                ))}
              </ul>
              <Link 
                to={`/products?farmerId=${farmer?._id}`}
                className="block text-center w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Shop from this Farm
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
