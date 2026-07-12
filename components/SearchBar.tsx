'use client'

import { useDebounce } from '@/hooks/useDebounce'
import { searchProducts } from '@/api-client/productApi'
import { Product } from '@/types'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { formatCurrency } from '@/lib/formatters'
import Link from 'next/link'

type SearchBarProps = {
  autoFocus?: boolean
  className?: string
  onResultSelect?: () => void
}

const SearchBar = ({
  autoFocus = false,
  className = '',
  onResultSelect,
}: SearchBarProps) => {
  const [searchText, setSearchText] = useState<string>('')

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearchText = useDebounce(searchText, 500)
  const { data: searchedProduct = [], isLoading } = useSWR(
    debouncedSearchText ? debouncedSearchText : null,
    () => searchProducts(debouncedSearchText),
  )

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

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

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div
      className={`relative w-full lg:max-w-md ${className}`}
      ref={searchContainerRef}
    >
      <div className="flex h-11 w-full items-center justify-between rounded-full border border-mist-gray bg-moon-ivory/50 px-4 transition-all focus-within:bg-warm-white focus-within:ring-2 focus-within:ring-mist-gray hover:bg-warm-white">
        <Search size={16} className="text-soft-taupe shrink-0" />

        <input
          ref={inputRef}
          className="flex-1 bg-transparent px-3 text-sm font-medium text-charcoal-cocoa outline-none placeholder:font-normal placeholder:text-soft-taupe/70"
          type="text"
          placeholder="Search crystals..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={() => {
            if (searchText.length > 0) setIsDropdownOpen(true)
          }}
        />

        {searchText.length > 0 && (
          <X
            size={16}
            className="cursor-pointer text-soft-taupe transition-colors hover:text-charcoal-cocoa shrink-0"
            onClick={() => {
              setSearchText('')
              setIsDropdownOpen(false)
            }}
          />
        )}
      </div>

      {isDropdownOpen && searchText.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 mt-3 w-full overflow-hidden rounded-3xl border border-mist-gray bg-warm-white p-2 shadow-[var(--shadow-boutique-heavy)] duration-300">
          {isLoading && (
            <div className="flex h-24 items-center justify-center">
              <span className="text-sm font-medium text-soft-taupe animate-pulse">
                Searching...
              </span>
            </div>
          )}

          {!isLoading && searchedProduct.length > 0 && (
            <div className="custom-scrollbar flex max-h-[60vh] flex-col gap-1 overflow-y-auto pt-1">
              <div className="px-4 pb-2 pt-2 text-xs font-bold tracking-widest uppercase text-soft-taupe">
                Results ({searchedProduct.length})
              </div>

              {searchedProduct.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => {
                    setIsDropdownOpen(false)
                    onResultSelect?.()
                  }}
                  className="group flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-moon-ivory"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-moon-ivory border border-mist-gray/50">
                    <Image
                      src={product.image}
                      alt={`${product.name} search result thumbnail`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-sm font-bold text-charcoal-cocoa group-hover:text-rose-clay transition-colors">
                      {product.name}
                    </span>
                    <span className="mt-1 block truncate text-xs font-medium text-soft-taupe">
                      {product.category} &middot; {formatCurrency(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && searchedProduct.length === 0 && (
            <div className="flex h-36 flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-charcoal-cocoa">
                No products found
              </p>
              <p className="mt-1.5 text-xs text-soft-taupe">Try another keyword</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
