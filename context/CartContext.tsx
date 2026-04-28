'use client'
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react'
import { cartReducer } from './cartReducer'
import { CartState, CartContextType, Product } from '@/types'

const initialState: CartState = {
  items: [],
  totalAmount: 0,
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState)
  const [isInitialized, setIsInitialized] = useState(false)

  // 1. 读取：只在组件初次挂载时执行一次
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) })
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
      // 标记初始化完成
      setIsInitialized(true)
    }
  }, [])

  // 2. 写入：只有在初始化完成后，且 items 发生变化时才写入
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cartState.items))
    }
  }, [cartState.items, isInitialized])

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
