'use client'
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import { cartReducer } from './cartReducer'
import { CartState, CartContextType, Product, CartItem } from '@/types'

const CART_STORAGE_KEY = 'cart'

const initialState: CartState = {
  items: [],
  totalAmount: 0,
}

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>

  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.description === 'string' &&
    typeof item.category === 'string' &&
    typeof item.image === 'string' &&
    typeof item.stock === 'number' &&
    typeof item.isActive === 'boolean' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
}

const getStoredCartItems = (): CartItem[] | null => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) {
      return null
    }

    const parsedCart: unknown = JSON.parse(savedCart)
    if (!Array.isArray(parsedCart) || !parsedCart.every(isCartItem)) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return null
    }

    return parsedCart
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error)
    localStorage.removeItem(CART_STORAGE_KEY)
    return null
  }
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState)
  const hasLoadedStoredCartRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedStoredCartRef.current) return

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items))
  }, [cartState.items])

  // Restore browser-only cart state after hydration to avoid SSR mismatch.
  useEffect(() => {
    const storedCartItems = getStoredCartItems()
    if (storedCartItems) {
      dispatch({ type: 'SET_CART', payload: storedCartItems })
    }

    hasLoadedStoredCartRef.current = true
  }, [])

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateCartItemQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const contextValue = useMemo(
    () => ({
      cartState,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
    }),
    [cartState, addToCart, removeFromCart, updateCartItemQuantity, clearCart],
  )

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
