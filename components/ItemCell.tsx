'use client'

import { Product } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { formatCurrency } from '@/lib/formatters'

const ItemCell = ({ item }: { item: Product }) => {
  const { addToCart } = useCart()

  return (
    // Smooth lift animation on hover + subtle shadow progression
    <Link
      href={`/product/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]"
    >
      {/* Image Container with precise square aspect ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Low Stock Tag Identifier */}
        {item.stock <= 20 && (
          <div className="absolute top-3 left-3 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white backdrop-blur-sm">
            仅剩 {item.stock} 件
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="line-clamp-1 text-base font-bold text-zinc-900"
          title={item.name}
        >
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500">
          {item.description}
        </p>

        {/* Footer actions */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-black text-zinc-900">
            {formatCurrency(item.price)}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(item)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-700 active:scale-95"
            aria-label="加入购物车"
            title="加入购物车"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ItemCell
