import { redirect } from 'next/navigation'

import Link from 'next/link'
import { Check, ArrowRight, ShoppingBag } from 'lucide-react'
import ClearCartHelper from '@/components/ClearCartHelper'
import { getOrderBySessionId } from '@/api-client/orderApi.server'

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
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-white px-4 py-16 sm:px-6 lg:px-8">
      {/* Premium Meta-style White Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] sm:p-10">
        {/* Animated Green Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
          <Check size={40} strokeWidth={3} className="animate-pulse" />
        </div>

        {/* Text Area */}
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
          支付成功！
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
          我们已收到您的付款，您的订单正在火速备货中。感谢您在 Antigravity Store
          购物！
        </p>

        {/* Dynamic Order Info Box */}
        {session_id && (
          <div className="mt-8 flex flex-col gap-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 text-left">
            <div className="flex items-center justify-between border-b border-zinc-200/40 pb-3 text-sm">
              <span className="font-medium text-zinc-400">订单编号</span>
              <span className="max-w-[200px] truncate font-mono text-xs font-bold text-zinc-900 select-all">
                {order.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-400">配送状态</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                待发货
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href={`/account/orders`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-6 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)] transition-all hover:bg-[#0143B5] hover:shadow-[0_6px_20px_rgba(0,100,224,0.4)] active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            查看订单
          </Link>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-6 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            返回首页
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <ClearCartHelper />
    </div>
  )
}
