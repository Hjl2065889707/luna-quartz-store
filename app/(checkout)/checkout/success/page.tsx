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
          <RotateCcw size={38} strokeWidth={2.8} className="text-zinc-600" />
        ),
        iconStyle: 'bg-zinc-100 text-zinc-600 shadow-inner',
        title: '支付已退款',
        description:
          '您的付款已完成，但商品库存在最终确认时不足。我们已经自动发起退款，测试模式下可以在 Stripe Dashboard 查看退款记录。',
      }
    }

    if (isPaid) {
      return {
        icon: <Check size={40} strokeWidth={3} className="animate-pulse" />,
        iconStyle: 'animate-bounce bg-emerald-50 text-emerald-500 shadow-inner',
        title: '支付成功！',
        description:
          '我们已收到您的付款，您的订单正在火速备货中。感谢您在 Antigravity Store 购物！',
      }
    }

    return {
      icon: <Clock size={38} strokeWidth={2.8} className="text-amber-600" />,
      iconStyle: 'bg-amber-50 text-amber-600 shadow-inner',
      title: '订单处理中',
      description:
        'Stripe 已完成支付跳转，我们正在等待 webhook 确认订单状态。页面会自动刷新几次，请稍候。',
    }
  })()

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-white px-4 py-16 sm:px-6 lg:px-8">
      {/* Premium Meta-style White Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] sm:p-10">
        {/* Animated Green Badge */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${pageContent.iconStyle}`}
        >
          {pageContent.icon}
        </div>

        {/* Text Area */}
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
          {pageContent.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
          {pageContent.description}
        </p>

        {/* Dynamic Order Info Box */}
        <div className="mt-8 flex flex-col gap-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 text-left">
          {order ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-200/40 pb-3 text-sm">
                <span className="font-medium text-zinc-400">订单编号</span>
                <span className="max-w-[200px] truncate font-mono text-xs font-bold text-zinc-900 select-all">
                  {order.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-400">订单状态</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusConfig?.style}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {statusConfig?.label}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
              订单处理中，请稍后刷新查看...
            </div>
          )}
        </div>

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

      {isPaid && <ClearCartHelper />}
      {!order && <RefreshOrderStatusHelper />}
    </div>
  )
}
