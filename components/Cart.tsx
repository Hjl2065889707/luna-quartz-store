'use client'

import { useCart } from '@/context/CartContext'
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { formatCurrency } from '@/lib/formatters'

const Cart = () => {
  const { cartState, updateCartItemQuantity, removeFromCart } = useCart()
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const router = useRouter()

  // Industrial Practice: the badge should reflect total pieces, not total unique items.
  const totalItemCount = cartState.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  )

  // Ref for 'click outside' logic
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Best Practice: Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      // If we clicked something outside of cartRef, close it
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false)
      }
    }

    if (isOpenDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpenDropdown])

  const handleCheckoutButtonClick = () => {
    setIsOpenDropdown(false)
    router.push('/checkout')
  }

  return (
    <div
      className="relative flex items-center justify-center p-1"
      ref={cartRef}
    >
      {/* 🚀 Icon Trigger */}
      <button
        className="relative flex cursor-pointer items-center justify-center rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        aria-label="Cart"
      >
        <ShoppingBag size={22} strokeWidth={2} />

        {cartState.items.length > 0 && (
          <div className="absolute top-1 right-1 flex h-[18px] min-w-[18px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-amber-500 px-1 pt-px text-[10px] leading-none font-black text-white opacity-90 shadow-sm ring-2 ring-white">
            {cartState.items.length > 99 ? '99+' : cartState.items.length}
          </div>
        )}
      </button>

      {/* 🚀 Floating Dropdown Popup */}
      {isOpenDropdown && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute top-full right-0 z-50 mt-4 w-[360px] origin-top-right overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4">
            <h3 className="font-semibold text-zinc-900">Shopping bag</h3>
            <div className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-bold text-zinc-600">
              {totalItemCount} items
            </div>
          </div>

          {/* Condition A: Empty State */}
          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-300">
                <ShoppingBag size={32} />
              </div>
              <p className="text-sm font-medium text-zinc-900">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Find a crystal you love
              </p>
            </div>
          ) : (
            /* Condition B: Filled State */
            <>
              {/* Scrollable list */}
              <div className="custom-scrollbar flex max-h-[360px] flex-col gap-4 overflow-y-auto p-4">
                {cartState.items.map((item) => (
                  <div className="group flex items-start gap-4" key={item.id}>
                    {/* Item Image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/50">
                      <Image
                        src={item.image}
                        fill
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div className="flex justify-between gap-2">
                        <span
                          className="line-clamp-1 text-sm font-bold text-zinc-900"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <span className="text-sm font-black text-zinc-900">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* Interactive Controls */}
                      <div className="mt-2 flex items-center justify-between">
                        {/* Minus / Number / Plus */}
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex cursor-pointer items-center justify-center text-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-400"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-5 text-center font-bold text-zinc-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            className="flex cursor-pointer items-center justify-center text-zinc-400 hover:text-zinc-900"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Delete Trash Icon (Hidden until hover) */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex cursor-pointer items-center text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-zinc-100 bg-zinc-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-500">
                    Estimated total
                  </span>
                  <span className="text-xl font-black text-zinc-900">
                    {formatCurrency(cartState.totalAmount)}
                  </span>
                </div>
                <button
                  onClick={() => handleCheckoutButtonClick()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-[0.98]"
                >
                  Checkout
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Cart
