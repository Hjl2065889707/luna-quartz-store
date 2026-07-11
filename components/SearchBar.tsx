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
      <div className="flex h-10 w-full items-center justify-between rounded-full border border-[#E8E1D8] bg-white/70 px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E9D8DC] hover:bg-white">
        <Search size={16} className="text-[#B9AAA2]" />

        <input
          ref={inputRef}
          className="flex-1 bg-transparent px-3 text-sm font-medium text-[#2F2523] outline-none placeholder:font-normal placeholder:text-[#B9AAA2]"
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
            className="cursor-pointer text-[#B9AAA2] transition-colors hover:text-[#2F2523]"
            onClick={() => {
              setSearchText('')
              setIsDropdownOpen(false)
            }}
          />
        )}
      </div>

      {isDropdownOpen && searchText.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-3xl border border-[#E8E1D8] bg-white p-2 shadow-[0_24px_70px_rgba(74,50,39,0.16)] duration-200">
          {isLoading && (
            <div className="flex h-20 items-center justify-center">
              <span className="text-sm font-medium text-[#7B6D66]">
                Searching...
              </span>
            </div>
          )}

          {!isLoading && searchedProduct.length > 0 && (
            <div className="custom-scrollbar flex max-h-[60vh] flex-col gap-1 overflow-y-auto pt-1">
              <div className="px-3 pb-2 pt-1 text-xs font-bold tracking-wider text-[#7B6D66]">
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
                  className="group flex items-center gap-4 rounded-2xl px-3 py-2 transition-colors hover:bg-[#FBF7F1]"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F4EEE6] ring-1 ring-[#E8E1D8]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-sm font-bold text-[#2F2523]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-[#7B6D66]">
                      {product.category} · {formatCurrency(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && searchedProduct.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-[#2F2523]">
                No products found
              </p>
              <p className="mt-1 text-xs text-[#7B6D66]">Try another keyword</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
