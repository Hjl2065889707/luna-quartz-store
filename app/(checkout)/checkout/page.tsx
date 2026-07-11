'use client'

import { createCheckoutSession } from '@/api-client/orderApi'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/classnameUtils'
import { CheckoutFormValues, checkoutSchema } from '@/lib/schemas/checkout'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/context/ToastContext'
import { CheckoutItemSnapshot } from '@/lib/schemas/checkout'
import { formatCurrency } from '@/lib/formatters'

export default function CheckoutPage() {
  const { cartState } = useCart()
  const router = useRouter()
  const { showToast } = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  })

  const isPaying = isSubmitting || isRedirecting

  const onSubmit = async (data: CheckoutFormValues) => {
    const items: CheckoutItemSnapshot[] = cartState.items.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    try {
      const { url } = await createCheckoutSession(items, data)
      setIsRedirecting(true)
      window.location.assign(url)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Checkout failed. Please try again.'
      showToast(message, 'error')
    }
  }

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/')
    }
  }, [cartState.items.length, router])

  if (cartState.items.length === 0) return null

  return (
    <div className="bg-[#FBF7F1]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
          Secure checkout
        </p>
        <h1 className="mt-3 text-4xl font-black text-[#2F2523]">
          Complete your test order
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7B6D66]">
          Stripe runs in test mode for this portfolio demo. No real fulfilment
          will be processed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-[2rem] border border-[#E8E1D8] bg-white p-6 shadow-[0_12px_30px_rgba(74,50,39,0.05)] sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-[#2F2523]">
              Shipping details
            </h2>

            <form
              id="checkout-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2523]">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your First Name"
                    {...register('firstName')}
                    className={cn(
                      'w-full rounded-2xl border border-[#E8E1D8] px-4 py-3 text-[#2F2523] transition-all outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]',
                      errors.firstName &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500',
                    )}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2F2523]">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Last Name"
                    {...register('lastName')}
                    className={cn(
                      'w-full rounded-2xl border border-[#E8E1D8] px-4 py-3 text-[#2F2523] transition-all outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]',
                      errors.lastName &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500',
                    )}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2523]">
                  Address
                </label>
                <input
                  type="text"
                  className={cn(
                    'w-full rounded-2xl border border-[#E8E1D8] px-4 py-3 text-[#2F2523] transition-all outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]',
                    errors.address &&
                      'border-red-500 focus:border-red-500 focus:ring-red-500',
                  )}
                  {...register('address')}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2F2523]">
                  Phone
                </label>
                <input
                  type="tel"
                  className={cn(
                    'w-full rounded-2xl border border-[#E8E1D8] px-4 py-3 text-[#2F2523] transition-all outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#E9D8DC]',
                    errors.phone &&
                      'border-red-500 focus:border-red-500 focus:ring-red-500',
                  )}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-[2rem] border border-[#E8E1D8] bg-white p-6 shadow-[0_12px_30px_rgba(74,50,39,0.06)] sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-[#2F2523]">Order summary</h2>

            <div className="custom-scrollbar mb-6 max-h-[40vh] space-y-4 overflow-y-auto pr-2">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E8E1D8] bg-[#F4EEE6]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#B76E79] text-[10px] font-bold text-white ring-2 ring-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="line-clamp-2 text-sm font-bold text-[#2F2523]">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-sm font-black text-[#2F2523]">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-[#E8E1D8] pt-6 text-sm text-[#7B6D66]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#2F2523]">
                  {formatCurrency(cartState.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated shipping</span>
                <span className="font-medium text-[#2F2523]">Free</span>
              </div>
              <div className="flex justify-between border-t border-[#E8E1D8] pt-3 text-base font-black text-[#2F2523]">
                <span>Total</span>
                <span className="text-xl text-[#2F2523]">
                  {formatCurrency(cartState.totalAmount)}
                </span>
              </div>
            </div>

            <button
              className="mt-8 w-full rounded-full bg-[#2F2523] py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              form="checkout-form"
              type="submit"
              disabled={isPaying}
            >
              {isPaying ? 'Creating order...' : 'Continue to payment'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
