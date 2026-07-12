'use client'

import { useCart } from '@/context/CartContext'
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { formatCurrency } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'

const Cart = () => {
  const { cartState, updateCartItemQuantity, removeFromCart } = useCart()
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const router = useRouter()

  const totalItemCount = cartState.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  )

  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
        className="relative flex cursor-pointer items-center justify-center rounded-full p-2 text-charcoal-cocoa transition-colors hover:bg-mist-gray/40"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        aria-label="Cart"
      >
        <ShoppingBag size={22} strokeWidth={2} />

        {cartState.items.length > 0 && (
          <div className="absolute right-1 top-1 flex h-[18px] min-w-[18px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-rose-clay px-1 pt-px text-[10px] leading-none font-black text-white shadow-sm ring-2 ring-white">
            {cartState.items.length > 99 ? '99+' : cartState.items.length}
          </div>
        )}
      </button>

      {isOpenDropdown && (
        <div className="animate-in fade-in slide-in-from-top-4 absolute right-0 top-full z-50 mt-4 w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-3xl bg-warm-white shadow-[var(--shadow-boutique-heavy)] border border-mist-gray duration-300 sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-mist-gray bg-moon-ivory p-5">
            <h3 className="font-bold text-charcoal-cocoa text-lg">Shopping bag</h3>
            <div className="rounded-full bg-mist-gray/50 px-3 py-1 text-xs font-bold text-soft-taupe">
              {totalItemCount} items
            </div>
          </div>

          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mist-gray/30 text-rose-clay">
                <ShoppingBag size={32} />
              </div>
              <p className="text-base font-bold text-charcoal-cocoa">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-soft-taupe">
                Find a crystal you love
              </p>
            </div>
          ) : (
            <>
              <div className="custom-scrollbar flex max-h-[400px] flex-col gap-5 overflow-y-auto p-5">
                {cartState.items.map((item) => (
                  <div className="group flex items-start gap-4" key={item.id}>
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-moon-ivory border border-mist-gray/50">
                      <Image
                        src={item.image}
                        fill
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between gap-2">
                        <span
                          className="line-clamp-1 text-sm font-bold text-charcoal-cocoa"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <span className="text-sm font-bold text-charcoal-cocoa">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-mist-gray bg-moon-ivory/50 px-2 py-1 text-xs transition-colors hover:bg-moon-ivory">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-6 w-6 cursor-pointer items-center justify-center text-soft-taupe hover:text-charcoal-cocoa disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-soft-taupe"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-5 text-center font-bold text-charcoal-cocoa">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-6 w-6 cursor-pointer items-center justify-center text-soft-taupe hover:text-charcoal-cocoa"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex cursor-pointer items-center text-soft-taupe opacity-0 transition-all group-hover:opacity-100 hover:text-deep-rose p-2 -mr-2"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-mist-gray bg-moon-ivory/50 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-soft-taupe">
                    Estimated total
                  </span>
                  <span className="text-xl font-bold text-charcoal-cocoa">
                    {formatCurrency(cartState.totalAmount)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckoutButtonClick}
                  className="w-full text-base h-12"
                  variant="primary"
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Cart
