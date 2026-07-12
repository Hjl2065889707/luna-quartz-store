import { redirect } from 'next/navigation'

import Link from 'next/link'
import {
  Check,
  ArrowRight,
  ShoppingBag,
  Loader2,
  RotateCcw,
  Clock,
} from 'lucide-react'
import ClearCartHelper from '@/components/ClearCartHelper'
import { getOrderBySessionId } from '@/api-client/orderApi.server'
import { ORDER_STATUS, getOrderStatusConfig } from '@/lib/orderStatus'
import RefreshOrderStatusHelper from '@/components/RefreshOrderStatusHelper'

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams
  if (!session_id) {
    redirect('/')
  }
  const order = await getOrderBySessionId(session_id)
  const isRefunded = order?.status === ORDER_STATUS.REFUNDED
  const isPaid = order?.status === ORDER_STATUS.PAID
  const statusConfig = order ? getOrderStatusConfig(order.status) : null

  const pageContent = (() => {
    if (isRefunded) {
      return {
        icon: (
          <RotateCcw size={38} strokeWidth={2.8} className="text-stone-600" />
        ),
        iconStyle: 'bg-stone-100 text-stone-600 shadow-inner',
        title: 'Payment refunded',
        description:
          'Your payment completed, but final stock confirmation failed. A test-mode refund has been created.',
      }
    }

    if (isPaid) {
      return {
        icon: <Check size={40} strokeWidth={3} className="animate-pulse" />,
        iconStyle: 'animate-bounce bg-emerald-50 text-emerald-500 shadow-inner',
        title: 'Payment successful',
        description:
          'Your test payment was confirmed and the order has been recorded.',
      }
    }

    return {
      icon: <Clock size={38} strokeWidth={2.8} className="text-amber-600" />,
      iconStyle: 'bg-amber-50 text-amber-600 shadow-inner',
      title: 'Order processing',
      description:
        'Stripe has redirected back to the store. We are waiting for the webhook to confirm the order status.',
    }
  })()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#FBF7F1] px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#E8E1D8] bg-white p-8 text-center shadow-[0_24px_70px_rgba(74,50,39,0.12)] sm:p-10">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${pageContent.iconStyle}`}
        >
          {pageContent.icon}
        </div>

        <h1 className="text-3xl font-black tracking-tight text-[#2F2523] sm:text-4xl">
          {pageContent.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-[#7B6D66]">
          {pageContent.description}
        </p>

        <div className="mt-8 flex flex-col gap-3.5 rounded-3xl border border-[#E8E1D8] bg-[#FBF7F1] p-5 text-left">
          {order ? (
            <>
              <div className="flex items-center justify-between border-b border-[#E8E1D8] pb-3 text-sm">
                <span className="font-medium text-[#7B6D66]">Order ID</span>
                <span className="max-w-[200px] truncate font-mono text-xs font-bold text-[#2F2523] select-all">
                  {order.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#7B6D66]">Order status</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusConfig?.style}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {statusConfig?.label}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-[#7B6D66]">
              <Loader2 size={16} className="animate-spin" />
              Order processing. Please wait...
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Link
            href={`/account/orders`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2F2523] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            View orders
          </Link>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-[#E8E1D8] bg-white px-6 text-sm font-bold text-[#2F2523] transition-all hover:bg-[#F4EEE6] active:scale-[0.98]"
          >
            Back home
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {isPaid && <ClearCartHelper />}
      {!order && <RefreshOrderStatusHelper />}
    </div>
  )
}
