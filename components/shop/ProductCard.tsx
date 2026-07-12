'use client'

import { Product } from '@/types'
import { formatCurrency } from '@/lib/formatters'
import { useCart } from '@/context/CartContext'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  const isLowStock = product.stock > 0 && product.stock <= 8

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-mist-gray bg-warm-white transition-all duration-500 ease-out hover:-translate-y-1 hover:border-rose-clay/30 hover:shadow-[var(--shadow-boutique)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-moon-ivory">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
          <Badge variant="secondary">
            {product.category}
          </Badge>
          {isLowStock && (
            <Badge variant="destructive">
              Only {product.stock} left
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3
            className="line-clamp-2 text-base font-bold leading-relaxed text-charcoal-cocoa transition-colors group-hover:text-rose-clay"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-soft-taupe">
            {product.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-charcoal-cocoa">
            {formatCurrency(product.price)}
          </span>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="h-10 px-4 gap-2 transition-transform active:scale-95"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              addToCart(product)
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
