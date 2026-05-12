import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('farmdirect-user')
    return stored ? JSON.parse(stored) : null
  })
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
    // 2. Fallback to manually set pincode (default to Global for new guests)
    return localStorage.getItem('farmdirect-pincode') || '000'
  })

  const [nearbyProducts, setNearbyProducts] = useState([])
  const [locationInfo, setLocationInfo] = useState(() => {
    const saved = localStorage.getItem('farmdirect-location')
    return saved ? JSON.parse(saved) : { district: 'India', state: 'Global' }
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
    const syncUser = async () => {
      const stored = localStorage.getItem('farmdirect-user')
      if (stored) {
        const currentUser = JSON.parse(stored)
        if (currentUser._id) {
          try {
            const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
            // Check for latest data
            const res = await fetch(`${apiUrl}/api/user/check?mobile=${currentUser.mobile}&email=${currentUser.email}`);
            const data = await res.json();
            if (res.ok && data.user) {
              login(data.user); // Sync local storage and state
            }
          } catch (err) {
            console.error("Failed to sync user profile:", err);
          }
        }
      }
    }
    syncUser();
  }, [])

  const login = (userData) => {
    localStorage.setItem('farmdirect-user', JSON.stringify(userData))
    setUser(userData)
  }

  const updateUser = async (updates) => {
    if (!user || !user._id) {
       // fallback for purely local changes if missing ID
       const updated = { ...user, ...updates }
       login(updated)
       return updated
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
      
      let body;
      let headers = {};
      
      // Check if any update is a File (e.g. profileImage)
      const hasFile = Object.values(updates).some(val => val instanceof File);
      
      if (hasFile) {
        const formData = new FormData();
        Object.keys(updates).forEach(key => {
          if (updates[key] !== undefined && updates[key] !== null) {
            formData.append(key, updates[key]);
          }
        });
        body = formData;
        // Don't set Content-Type header for FormData, let browser set it with boundary
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(updates);
      }

      const res = await fetch(`${apiUrl}/api/customers/update/${user._id}`, {
        method: 'PUT',
        headers,
        body
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user);
        return data.user;
      } else {
        console.error("Update failed:", data.error);
        return null;
      }
    } catch (err) {
      console.error("Network error:", err);
      return null;
    }
  }

  const logout = () => {
    localStorage.removeItem('farmdirect-user')
    setUser(null)
  }

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const productId = product.id || product._id
      const exists = prev.find(item => (item.id || item._id) === productId)
      if (exists) {
        return prev.filter(item => (item.id || item._id) !== productId)
      }
      return [...prev, product]
    })
  }

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const productId = product.id || product._id
      const filtered = prev.filter(item => (item.id || item._id) !== productId)
      return [product, ...filtered].slice(0, 12)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const updatePincode = async (code) => {
    const finalCode = code || '000'
    setPincode(finalCode)
    if (finalCode && finalCode.length === 6) {
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
          const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
          const res = await fetch(`${apiUrl}/api/products/local?district=${encodeURIComponent(district)}`)
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
      setLocationInfo({ district: 'India', state: 'Global' })
      if (!code) setPincode('000')
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, login, logout, updateUser,
      wishlist, toggleWishlist, 
      recentlyViewed, addToRecentlyViewed, clearRecentlyViewed,
      pincode: pincode || '000', updatePincode,
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
