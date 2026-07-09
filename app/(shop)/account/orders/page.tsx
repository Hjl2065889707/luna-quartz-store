import { getUserOrders } from '@/api-client/orderApi.server'
import { ShoppingBag, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getOrderStatusConfig, ORDER_STATUS } from '@/lib/orderStatus'
import { formatCurrency } from '@/lib/formatters'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const OrderPage = async () => {
  const orders = await getUserOrders()

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            我的订单
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            查看您在 Antigravity Store 的历史购买记录和订单状态。
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <ShoppingBag size={22} />
        </div>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-300">
            <ShoppingBag size={30} />
          </div>
          <h3 className="text-base font-bold text-zinc-900">还没有订单</h3>
          <p className="mt-1 text-sm text-zinc-500">
            您还没有在商店购买过任何商品。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#0064E0] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#0143B5]"
          >
            去商店逛逛
          </Link>
        </div>
      ) : (
        /* Order List */
        <div className="space-y-6">
          {orders.map((order) => {
            const status = getOrderStatusConfig(order.status)
            const isRefunded = order.status === ORDER_STATUS.REFUNDED
            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="font-medium text-zinc-700">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-400">单号</span>
                    <span className="rounded bg-zinc-200/50 px-2 py-0.5 font-mono font-bold text-zinc-700">
                      {order.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${status.style}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
              </div>

              {isRefunded && (
                <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 text-xs font-medium text-zinc-600">
                  这笔订单已自动退款。通常是因为支付完成后库存最终确认不足，您可以调整购物车后重新下单。
                </div>
              )}

              {/* Order Items */}
              <div className="divide-y divide-zinc-100 px-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex py-6 last:pb-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-300">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="line-clamp-1 text-sm font-bold text-zinc-900">
                            {item.product?.name || '未知商品'}
                          </h4>
                          <span className="text-sm font-black text-zinc-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                          {item.product?.description}
                        </p>
                      </div>
                      <div className="text-xs text-zinc-500">
                        <span>数量：x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col gap-4 border-t border-zinc-100 bg-zinc-50/20 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin size={13} />
                  <span className="line-clamp-1 max-w-[240px] font-medium text-zinc-600">
                    {order.firstName} {order.lastName} · {order.address}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 text-sm text-zinc-500">
                  <span>{isRefunded ? '退款金额：' : '实付款：'}</span>
                  <span className="text-xl font-black text-zinc-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderPage
