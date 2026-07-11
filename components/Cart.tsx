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
      <button
        className="relative flex cursor-pointer items-center justify-center rounded-full p-2 text-[#2F2523] transition-colors hover:bg-[#F4EEE6]"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        aria-label="Cart"
      >
        <ShoppingBag size={22} strokeWidth={2} />

        {cartState.items.length > 0 && (
          <div className="absolute right-1 top-1 flex h-[18px] min-w-[18px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-[#B76E79] px-1 pt-px text-[10px] leading-none font-black text-white shadow-sm ring-2 ring-white">
            {cartState.items.length > 99 ? '99+' : cartState.items.length}
          </div>
        )}
      </button>

      {isOpenDropdown && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute right-0 top-full z-50 mt-4 w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(74,50,39,0.16)] ring-1 ring-[#E8E1D8] duration-200 sm:w-[360px]">
          <div className="flex items-center justify-between border-b border-[#E8E1D8] bg-[#FBF7F1] p-4">
            <h3 className="font-semibold text-[#2F2523]">Shopping bag</h3>
            <div className="rounded-full bg-[#F4EEE6] px-2 py-0.5 text-xs font-bold text-[#7B6D66]">
              {totalItemCount} items
            </div>
          </div>

          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE6] text-[#B76E79]">
                <ShoppingBag size={32} />
              </div>
              <p className="text-sm font-medium text-[#2F2523]">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-[#7B6D66]">
                Find a crystal you love
              </p>
            </div>
          ) : (
            <>
              <div className="custom-scrollbar flex max-h-[360px] flex-col gap-4 overflow-y-auto p-4">
                {cartState.items.map((item) => (
                  <div className="group flex items-start gap-4" key={item.id}>
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F4EEE6] ring-1 ring-[#E8E1D8]">
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
                          className="line-clamp-1 text-sm font-bold text-[#2F2523]"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <span className="text-sm font-black text-[#2F2523]">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* Interactive Controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-[#E8E1D8] bg-[#FBF7F1] px-2 py-1 text-xs">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex cursor-pointer items-center justify-center text-[#B9AAA2] hover:text-[#2F2523] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#B9AAA2]"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-5 text-center font-bold text-[#2F2523]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            className="flex cursor-pointer items-center justify-center text-[#B9AAA2] hover:text-[#2F2523]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex cursor-pointer items-center text-[#B9AAA2] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E1D8] bg-[#FBF7F1] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#7B6D66]">
                    Estimated total
                  </span>
                  <span className="text-xl font-black text-[#2F2523]">
                    {formatCurrency(cartState.totalAmount)}
                  </span>
                </div>
                <button
                  onClick={() => handleCheckoutButtonClick()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2F2523] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.98]"
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
