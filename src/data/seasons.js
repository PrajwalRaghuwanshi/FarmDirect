import { Sun, CloudRain, Snowflake, Sprout } from 'lucide-react'

export const seasons = [
  {
    id: 'summer',
    dbValue: 'Summer',
    name: 'Zaid (Summer)',
    icon: Sun,
    image: '/images/summer_sun.png',
    desc: 'Juicy fruits and refreshing produce to beat the heat.',
    color: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-900/20'
  },
  {
    id: 'monsoon',
    dbValue: 'Monsoon',
    name: 'Kharif (Monsoon)',
    icon: CloudRain,
    image: '/images/monsoon_clouds.png',
    desc: 'Freshly washed greens and vibrant regional specialties.',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-teal-50',
    darkBg: 'dark:bg-teal-900/20'
  },
  {
    id: 'winter',
    dbValue: 'Winter',
    name: 'Rabi (Winter)',
    icon: Snowflake,
    image: '/images/winter_fog.png',
    desc: 'Crisp apples, root vegetables, and hearty staples.',
    color: 'from-blue-400 to-indigo-500',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20'
  },
  {
    id: 'all-season',
    dbValue: 'All-Season',
    name: 'Barahmasi (All-Season)',
    icon: Sprout,
    image: '/images/all_seasons.png',
    desc: 'Everyday essentials available fresh throughout the year.',
    color: 'from-green-400 to-emerald-600',
    lightBg: 'bg-green-50',
    darkBg: 'dark:bg-green-900/20'
  }
]
