'use client'

import { useCart } from '@/context/CartContext'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
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
        className="text-charcoal-cocoa hover:bg-mist-gray/40 relative flex cursor-pointer items-center justify-center rounded-full p-2 transition-colors"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        aria-label="Cart"
      >
        <ShoppingBag size={22} strokeWidth={2} />

        {cartState.items.length > 0 && (
          <div className="bg-rose-clay absolute top-1 right-1 flex h-[18px] min-w-[18px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full px-1 pt-px text-[10px] leading-none font-black text-white shadow-sm ring-2 ring-white">
            {cartState.items.length > 99 ? '99+' : cartState.items.length}
          </div>
        )}
      </button>

      {isOpenDropdown && (
        <div className="animate-in fade-in slide-in-from-top-4 bg-warm-white border-mist-gray absolute top-full right-0 z-50 mt-4 w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-3xl border shadow-[var(--shadow-boutique-heavy)] duration-300 sm:w-[380px]">
          <div className="border-mist-gray bg-moon-ivory flex items-center justify-between border-b p-5">
            <h3 className="text-charcoal-cocoa text-lg font-bold">
              Shopping bag
            </h3>
            <div className="bg-mist-gray/50 text-soft-taupe rounded-full px-3 py-1 text-xs font-bold">
              {totalItemCount} items
            </div>
          </div>

          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="bg-mist-gray/30 text-rose-clay mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                <ShoppingBag size={32} />
              </div>
              <p className="text-charcoal-cocoa text-base font-bold">
                Your cart is empty
              </p>
              <p className="text-soft-taupe mt-2 text-sm">
                Find a crystal you love
              </p>
            </div>
          ) : (
            <>
              <div className="custom-scrollbar flex max-h-[400px] flex-col gap-5 overflow-y-auto p-5">
                {cartState.items.map((item) => (
                  <div className="group flex items-start gap-4" key={item.id}>
                    <div className="bg-moon-ivory border-mist-gray/50 relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border">
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
                          className="text-charcoal-cocoa line-clamp-1 text-sm font-bold"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <span className="text-charcoal-cocoa text-sm font-bold">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="border-mist-gray bg-moon-ivory/50 hover:bg-moon-ivory flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition-colors">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="text-soft-taupe hover:text-charcoal-cocoa disabled:hover:text-soft-taupe flex h-6 w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-charcoal-cocoa w-5 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            className="text-soft-taupe hover:text-charcoal-cocoa flex h-6 w-6 cursor-pointer items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-soft-taupe hover:text-deep-rose -mr-2 flex cursor-pointer items-center p-2 opacity-0 transition-all group-hover:opacity-100"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-mist-gray bg-moon-ivory/50 border-t p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-soft-taupe text-sm font-bold">
                    Estimated total
                  </span>
                  <span className="text-charcoal-cocoa text-xl font-bold">
                    {formatCurrency(cartState.totalAmount)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckoutButtonClick}
                  className="h-12 w-full text-base"
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
