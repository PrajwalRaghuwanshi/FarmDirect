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

  useEffect(() => {
    localStorage.setItem('farmdirect-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('farmdirect-recent', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

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

  return (
    <UserContext.Provider value={{ 
      user, login, logout, 
      wishlist, toggleWishlist, 
      recentlyViewed, addToRecentlyViewed, clearRecentlyViewed 
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
