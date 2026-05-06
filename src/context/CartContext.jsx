import {
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { CartContext } from './cart-context'

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
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
        const id = Date.now()
        setToast({ message: `${product.name} (${quantity}) was added to cart`, id })
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
      placeOrder(customerDetails) {
        dispatch({
          type: 'PLACE_ORDER',
          payload: { subtotal, deliveryFee, total, customerDetails },
        })
      },
    }
  }, [state, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
