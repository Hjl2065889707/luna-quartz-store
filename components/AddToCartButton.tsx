'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  return (
    <button
      disabled={product.stock <= 0}
      className="w-full rounded-full bg-zinc-900 px-8 py-4 text-base font-bold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      onClick={() => addToCart(product)}
    >
      加入购物车
    </button>
  )
}

export default AddToCartButton
