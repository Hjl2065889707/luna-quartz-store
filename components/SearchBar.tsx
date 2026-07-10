'use client'

import { useCart } from '@/context/CartContext'
import { useDebounce } from '@/hooks/useDebounce'
import { searchProducts } from '@/api-client/productApi'
import { Product } from '@/types'
import { Plus, Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { formatCurrency } from '@/lib/formatters'

const SearchBar = () => {
  const { addToCart } = useCart()
  const [searchText, setSearchText] = useState<string>('')

  // UX Best Practice: Track if the dropdown should be visible (Click-Outside pattern)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const debouncedSearchText = useDebounce(searchText, 500)
  const { data: searchedProduct = [], isLoading } = useSWR(
    debouncedSearchText ? debouncedSearchText : null,
    () => searchProducts(debouncedSearchText),
  )

  // UX Best Practice: Global Click-Outside Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside our search container wrapper, close the dropdown
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    // Only listen when the dropdown is actually open (Performance optimization)
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    // 1. The relative container that holds everything and acts as the boundary
    <div className="relative w-full max-w-md" ref={searchContainerRef}>
      {/* 2. 🔮 Search Input Pill - Sleek Focus Ring */}
      <div className="flex h-10 w-full items-center justify-between rounded-full bg-zinc-100 px-4 transition-all focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 focus-within:ring-zinc-900/10 hover:bg-zinc-200/50">
        <Search size={16} className="text-zinc-400" />

        <input
          className="flex-1 bg-transparent px-3 text-sm font-medium text-zinc-900 outline-none placeholder:font-normal placeholder:text-zinc-400"
          type="text"
          placeholder="Search crystals..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
            // Show dropdown immediately when user types
            setIsDropdownOpen(true)
          }}
          onFocus={() => {
            // Restore dropdown if user clicks back into input and there's text
            if (searchText.length > 0) setIsDropdownOpen(true)
          }}
        />

        {/* Clear Button */}
        {searchText.length > 0 && (
          <X
            size={16}
            className="cursor-pointer text-zinc-400 transition-colors hover:text-zinc-900"
            onClick={() => {
              setSearchText('')
              setIsDropdownOpen(false)
            }}
          />
        )}
      </div>

      {/* 3. 🔮 Premium Dropdown Popup */}
      {isDropdownOpen && searchText.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-200">
          {/* Loading State */}
          {isLoading && (
            <div className="flex h-20 items-center justify-center">
              <span className="text-sm font-medium text-zinc-400">
                Searching...
              </span>
            </div>
          )}

          {/* Results State */}
          {!isLoading && searchedProduct.length > 0 && (
            <div className="custom-scrollbar flex max-h-[60vh] flex-col gap-1 overflow-y-auto pt-1">
              <div className="px-3 pt-1 pb-2 text-xs font-bold tracking-wider text-zinc-400">
                Results ({searchedProduct.length})
              </div>

              {searchedProduct.map((product: Product) => (
                <div
                  key={product.id}
                  className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-4">
                    {/* Fixed aspect ratio wrapper for Next/Image */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-black/5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="line-clamp-1 text-sm font-bold text-zinc-900">
                        {product.name}
                      </span>
                      <span className="mt-0.5 text-xs font-black text-zinc-500">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Action */}
                  <button
                    onClick={() => {
                      addToCart(product)
                      // No explicit close here, matching the industrial standard!
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all group-hover:bg-zinc-900 group-hover:text-white group-hover:shadow-md active:scale-90"
                    aria-label="Add to cart"
                    title="Add to cart"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && searchedProduct.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-zinc-900">No products found</p>
              <p className="mt-1 text-xs text-zinc-500">Try another keyword</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
