import { prisma } from '@/lib/prisma'
import OrderStatusButton from '@/components/admin/OrderStatusButton'
import { getOrderStatusConfig } from '@/lib/orderStatus'

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C2B33]">订单管理</h1>
        <p className="mt-1 text-sm text-[#5D6C7B]">
          共 {orders.length} 个订单
        </p>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DEE3E9] bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#DEE3E9] bg-[#F7F8FA]">
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                订单编号
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                客户
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                商品
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                金额
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                状态
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                日期
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5D6C7B]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE3E9]">
            {orders.map((order) => {
              const status = getOrderStatusConfig(order.status)
              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[#F7F8FA]"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium text-[#5D6C7B]">
                      {order.id.slice(0, 12)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1C2B33]">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="text-xs text-[#5D6C7B]">
                        {order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#5D6C7B]">
                      {order.items.length} 件商品
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1C2B33]">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.style}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5D6C7B]">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN', {
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
  )
}
