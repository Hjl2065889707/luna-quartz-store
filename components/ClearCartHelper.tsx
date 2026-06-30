'use client'

import { useCart } from '@/context/CartContext'
import { useEffect } from 'react'

const ClearCartHelper = () => {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    localStorage.removeItem('cart')
  }, [clearCart])

  return null
}

export default ClearCartHelper
