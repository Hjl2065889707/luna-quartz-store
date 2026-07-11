'use client'

import { Product } from '@/types'
import { formatCurrency } from '@/lib/formatters'
import { useCart } from '@/context/CartContext'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  const isLowStock = product.stock > 0 && product.stock <= 8

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E8E1D8] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#D8CBBF] hover:shadow-[0_18px_45px_rgba(74,50,39,0.10)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F4EEE6]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7B6D66] backdrop-blur">
          {product.category}
        </div>
        {isLowStock && (
          <div className="absolute bottom-4 left-4 rounded-full bg-[#8F4F5B] px-3 py-1 text-[11px] font-semibold text-white">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3
            className="line-clamp-2 text-base font-semibold leading-6 text-[#2F2523]"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7B6D66]">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-[#2F2523]">
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              addToCart(product)
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2F2523] px-4 text-sm font-semibold text-white transition hover:bg-[#4A3732] active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
