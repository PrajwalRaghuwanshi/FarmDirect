import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('farmdirect-wishlist')
    return saved ? JSON.parse(saved) : []
  })

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('farmdirect-recent')
    return saved ? JSON.parse(saved) : []
  })

  const [pincode, setPincode] = useState(() => {
    // 1. Prioritize default address from the addresses list
    const savedAddresses = localStorage.getItem('farmdirect-addresses')
    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses)
        const defaultAddr = addresses.find(a => a.isDefault)
        if (defaultAddr) return defaultAddr.pincode
      } catch (err) {
        console.error("Failed to parse addresses:", err)
      }
    }
    // 2. Fallback to manually set pincode
    return localStorage.getItem('farmdirect-pincode') || ''
  })

  const [nearbyProducts, setNearbyProducts] = useState([])
  const [locationInfo, setLocationInfo] = useState(() => {
    const saved = localStorage.getItem('farmdirect-location')
    return saved ? JSON.parse(saved) : null
  })
  const [loadingLocal, setLoadingLocal] = useState(false)

  useEffect(() => {
    // Only fetch products if we have a pincode but no nearby products loaded yet
    if (pincode && pincode.length === 6 && nearbyProducts.length === 0) {
      updatePincode(pincode)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('farmdirect-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('farmdirect-recent', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  useEffect(() => {
    if (pincode) {
      localStorage.setItem('farmdirect-pincode', pincode)
    } else {
      localStorage.removeItem('farmdirect-pincode')
    }
  }, [pincode])

  useEffect(() => {
    if (locationInfo) {
      localStorage.setItem('farmdirect-location', JSON.stringify(locationInfo))
    } else {
      localStorage.removeItem('farmdirect-location')
    }
  }, [locationInfo])

  useEffect(() => {
    const stored = localStorage.getItem('farmdirect-user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem('farmdirect-user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('farmdirect-user')
    setUser(null)
  }

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id)
      return [product, ...filtered].slice(0, 12)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const updatePincode = async (code) => {
    setPincode(code)
    if (code && code.length === 6) {
      setLoadingLocal(true)
      try {
        // 1. Fetch District/State from India Post API Directly
        const response = await fetch(`https://api.postalpincode.in/pincode/${code}`)
        const data = await response.json()

        if (data && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0]
          const district = postOffice.District
          const state = postOffice.State
          
          setLocationInfo({ district, state })

          // 2. Fetch local products from backend based on the discovered district
          const res = await fetch(`http://localhost:5000/api/products/local?district=${encodeURIComponent(district)}`)
          const productData = await res.json()
          if (productData.products) {
            setNearbyProducts(productData.products)
          }
        }
      } catch (err) {
        console.error("Local discovery failed:", err)
      } finally {
        setLoadingLocal(false)
      }
    } else {
      setNearbyProducts([])
      setLocationInfo(null)
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, login, logout, 
      wishlist, toggleWishlist, 
      recentlyViewed, addToRecentlyViewed, clearRecentlyViewed,
      pincode, updatePincode,
      nearbyProducts, locationInfo, loadingLocal
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
