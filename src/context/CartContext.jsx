import {
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { CartContext } from './cart-context'
import { useUser } from './UserContext'

const STORAGE_KEY = 'farmer-market-cart'

function buildOrder(items, subtotal, deliveryFee, total, customerDetails) {
  return {
    id: `FM-${Date.now().toString().slice(-6)}`,
    placedOn: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    status: 'Order Confirmed',
    eta: 'Arriving tomorrow by 6:30 PM',
    customerDetails,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      lineTotal: item.price * item.quantity,
    })),
    receiptItems: items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.price * item.quantity,
    })),
    total,
    subtotal,
    deliveryFee,
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existingItem = state.items.find(
        (item) => item.cartKey === product.cartKey,
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.cartKey === product.cartKey
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
      }
    }
    case 'UPDATE_QUANTITY': {
      const { cartKey, quantity } = action.payload

      return {
        ...state,
        items: state.items
          .map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.cartKey !== action.payload),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'PLACE_ORDER': {
      const nextOrder = buildOrder(
        state.items,
        action.payload.subtotal,
        action.payload.deliveryFee,
        action.payload.total,
        action.payload.customerDetails,
      )

      return {
        ...state,
        items: [],
        recentOrder: nextOrder,
        orderHistory: [nextOrder, ...state.orderHistory],
      }
    }
    default:
      return state
  }
}

const initialState = {
  items: [],
  recentOrder: null,
  orderHistory: [],
}

export function CartProvider({ children }) {
  const { user } = useUser()
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY)

    if (!storedCart) {
      return
    }

    try {
      const parsedCart = JSON.parse(storedCart)

      if (Array.isArray(parsedCart.items)) {
        dispatch({
          type: 'HYDRATE',
          payload: {
            items: parsedCart.items ?? [],
            recentOrder: parsedCart.recentOrder ?? null,
            orderHistory: parsedCart.orderHistory ?? [],
          },
        })
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const normalizeId = (id) => {
    if (!id) return id;
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    return id.toString();
  };

  // Fetch orders from backend when user changes
  useEffect(() => {
    if (user) {
      const fetchUserOrders = async () => {
        try {
          const userId = normalizeId(user._id || user.id);
          if (!userId) return;
          
          const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
          const res = await fetch(`${apiUrl}/api/orders/user/${userId}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            dispatch({
              type: 'HYDRATE',
              payload: {
                ...state,
                orderHistory: data
              }
            });
          }
        } catch (err) {
          console.error("Failed to fetch user orders:", err);
        }
      }
      fetchUserOrders();
    }
  }, [user])

  const value = useMemo(() => {
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )
    const deliveryFee = subtotal > 0 ? 49 : 0
    const total = subtotal + deliveryFee

    return {
      items: state.items,
      recentOrder: state.recentOrder,
      orderHistory: state.orderHistory,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      toast,
      addItem(product, quantity = 1) {
        if (product.stock_level <= 0) {
          const id = Date.now()
          setToast({ message: `Sorry, ${product.name} is Sold Out!`, id, type: 'error' })
          setTimeout(() => {
            setToast(current => current?.id === id ? null : current)
          }, 3000)
          return
        }
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
        const id = Date.now()
        setToast({ message: `${product.name} (${quantity}) was added to cart`, id, type: 'success' })
        setTimeout(() => {
          setToast(current => current?.id === id ? null : current)
        }, 3000)
      },
      updateQuantity(cartKey, quantity) {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { cartKey, quantity } })
      },
      removeItem(cartKey) {
        dispatch({ type: 'REMOVE_ITEM', payload: cartKey })
      },
      clearCart() {
        dispatch({ type: 'CLEAR_CART' })
      },
      async placeOrder(customerDetails) {
        // Prepare detailed order payload for backend
        const orderPayload = {
          userId: normalizeId(user?._id || user?.id) || 'guest',
          userEmail: customerDetails.emailAddress || user?.email,
          customerDetails: {
            fullName: customerDetails.fullName,
            phoneNumber: customerDetails.phoneNumber,
            pincode: customerDetails.postalCode,
            address: customerDetails.streetAddress,
            state: customerDetails.state,
            district: customerDetails.city,
            notes: customerDetails.deliveryNotes
          },
          items: state.items.map(item => ({
            productId: normalizeId(item.id || item._id),
            farmerId: normalizeId(item.owner?._id || item.owner || item.farmerId),
            name: item.title || item.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
          })),
          summary: {
            subtotal,
            deliveryFee,
            total
          },
          status: 'Processing',
          placedAt: new Date().toISOString()
        }

        try {
          const apiUrl = import.meta.env.VITE_API_URL || "https://farmdirect-i7sd.onrender.com";
          const res = await fetch(`${apiUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
          
          if (!res.ok) {
            console.warn("Server rejected order, proceeding with mock local completion.");
          }
        } catch (err) {
          console.error("Failed to sync order with database:", err);
        }

        dispatch({
          type: 'PLACE_ORDER',
          payload: { subtotal, deliveryFee, total, customerDetails },
        })
      },
    }
  }, [state, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
