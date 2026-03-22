'use client'
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useMemo,
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

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateCartItemQuantity = useCallback((id: number, quantity: number) => {
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
