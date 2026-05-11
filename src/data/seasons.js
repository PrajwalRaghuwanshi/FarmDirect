import { Sun, CloudRain, Snowflake, Sprout } from 'lucide-react'

export const seasons = [
  {
    id: 'summer',
    dbValue: 'zaid',
    nameKey: 'seasonZaidName',
    descKey: 'seasonZaidDesc',
    icon: Sun,
    image: '/images/summer_sun.png',
    color: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-900/20'
  },
  {
    id: 'monsoon',
    dbValue: 'kharif',
    nameKey: 'seasonKharifName',
    descKey: 'seasonKharifDesc',
    icon: CloudRain,
    image: '/images/monsoon_clouds.png',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-teal-50',
    darkBg: 'dark:bg-teal-900/20'
  },
  {
    id: 'winter',
    dbValue: 'rabi',
    nameKey: 'seasonRabiName',
    descKey: 'seasonRabiDesc',
    icon: Snowflake,
    image: '/images/winter_fog.png',
    color: 'from-blue-400 to-indigo-500',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20'
  },
  {
    id: 'all-season',
    dbValue: 'all_season',
    nameKey: 'seasonBarahmasiName',
    descKey: 'seasonBarahmasiDesc',
    icon: Sprout,
    image: '/images/all_seasons.png',
    color: 'from-green-400 to-emerald-600',
    lightBg: 'bg-green-50',
    darkBg: 'dark:bg-green-900/20'
  }
]
