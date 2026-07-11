'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  return (
    <button
      disabled={product.stock <= 0}
      className="w-full rounded-full bg-[#2F2523] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#4A3732] disabled:cursor-not-allowed disabled:bg-[#E8E1D8] disabled:text-[#9A8D86] sm:w-auto"
      onClick={() => addToCart(product)}
    >
      Add to cart
    </button>
  )
}

export default AddToCartButton
