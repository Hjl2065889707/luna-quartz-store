import { getUserOrders } from '@/api-client/orderApi.server'
import { ShoppingBag, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getOrderStatusConfig, ORDER_STATUS } from '@/lib/orderStatus'
import { formatCurrency } from '@/lib/formatters'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-AU', {
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
    <div className="bg-[#FBF7F1]">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2F2523]">
            My orders
          </h1>
          <p className="mt-2 text-sm text-[#7B6D66]">
            Review your Luna & Quartz demo purchase history and order status.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EEE6] text-[#B76E79]">
          <ShoppingBag size={22} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8CBBF] bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE6] text-[#B76E79]">
            <ShoppingBag size={30} />
          </div>
          <h3 className="text-base font-bold text-[#2F2523]">No orders yet</h3>
          <p className="mt-1 text-sm text-[#7B6D66]">
            You have not placed any demo orders yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#2F2523] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#4A3732]"
          >
            Browse the store
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = getOrderStatusConfig(order.status)
            const isRefunded = order.status === ORDER_STATUS.REFUNDED
            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-[#E8E1D8] bg-white shadow-[0_12px_30px_rgba(74,50,39,0.05)] transition-all hover:shadow-[0_18px_45px_rgba(74,50,39,0.08)]"
              >
              <div className="flex flex-col gap-4 border-b border-[#E8E1D8] bg-[#FBF7F1] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#7B6D66]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span className="font-medium text-[#2F2523]">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#7B6D66]">Order ID</span>
                    <span className="rounded bg-white px-2 py-0.5 font-mono font-bold text-[#2F2523]">
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
                <div className="border-b border-[#E8E1D8] bg-[#F4EEE6] px-6 py-3 text-xs font-medium text-[#7B6D66]">
                  This order was automatically refunded because final stock
                  confirmation failed after payment.
                </div>
              )}

              <div className="divide-y divide-[#E8E1D8] px-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex py-6 last:pb-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E8E1D8] bg-[#F4EEE6]">
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={`${item.product.name} ordered product thumbnail`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#F4EEE6] text-[#B9AAA2]">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="line-clamp-1 text-sm font-bold text-[#2F2523]">
                            {item.product?.name || 'Unknown product'}
                          </h4>
                          <span className="text-sm font-black text-[#2F2523]">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-[#7B6D66]">
                          {item.product?.description}
                        </p>
                      </div>
                      <div className="text-xs text-[#7B6D66]">
                        <span>Qty: x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-[#E8E1D8] bg-[#FBF7F1] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 text-xs text-[#7B6D66]">
                  <MapPin size={13} />
                  <span className="line-clamp-1 max-w-[240px] font-medium text-[#7B6D66]">
                    {order.firstName} {order.lastName} · {order.address}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 text-sm text-[#7B6D66]">
                  <span>{isRefunded ? 'Refund amount:' : 'Paid:'}</span>
                  <span className="text-xl font-black text-[#2F2523]">
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
    </div>
  )
}

export default OrderPage
