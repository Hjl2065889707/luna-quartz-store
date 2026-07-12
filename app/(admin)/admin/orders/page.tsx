import { prisma } from '@/lib/prisma'
import OrderStatusButton from '@/components/admin/OrderStatusButton'
import { getOrderStatusConfig } from '@/lib/orderStatus'
import { formatCurrency } from '@/lib/formatters'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2F2523]">Orders</h1>
        <p className="mt-2 text-sm text-[#7B6D66]">
          {orders.length} orders recorded
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#E8E1D8] bg-white shadow-[0_12px_30px_rgba(74,50,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8E1D8] bg-[#FBF7F1]">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Order ID
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Items
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Total
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Date
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#7B6D66]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D8]">
              {orders.map((order) => {
                const status = getOrderStatusConfig(order.status)
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#FBF7F1]"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-medium text-[#7B6D66]">
                        {order.id.slice(0, 12)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#2F2523]">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-xs text-[#7B6D66]">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#7B6D66]">
                        {order.items.length} items
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2F2523]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.style}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7B6D66]">
                      {new Date(order.createdAt).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusButton
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
