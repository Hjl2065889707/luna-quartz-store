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

// JSON.parse 返回的是运行时数据，TypeScript 不能证明它一定符合 CartItem。
// 所以这里手动校验关键字段，把 localStorage 当成不可信输入来处理。
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
    // localStorage 可能被用户手动改掉，也可能残留旧版本数据。
    // 格式不对时直接清掉，回退到空购物车。
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

  // 这个写入 effect 故意放在下面的恢复 effect 前面。
  // 第一次执行时 ref 还是 false，所以会跳过写入，
  // 避免用空的初始购物车覆盖 localStorage 里已有的购物车。
  useEffect(() => {
    if (!hasLoadedStoredCartRef.current) return

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items))
  }, [cartState.items])

  // hydration 之后再恢复浏览器里的购物车。
  // 服务端渲染和客户端第一次渲染都使用 initialState，HTML 能保持一致。
  // ref 用来记录“已经恢复过购物车”，它变化时不会触发额外渲染。
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
