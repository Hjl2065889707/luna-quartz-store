import { prisma } from '@/lib/prisma'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { getOrderStatusConfig } from '@/lib/orderStatus'
import { formatCurrency } from '@/lib/formatters'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, recentOrders] = await Promise.all(
    [
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true },
      }),
    ],
  )

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
  })

  const stats = [
    {
      label: 'Revenue',
      value: formatCurrency(totalRevenue._sum.totalAmount ?? 0),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Orders',
      value: orderCount,
      icon: ShoppingCart,
      color: 'bg-[#E9D8DC] text-[#8F4F5B]',
    },
    {
      label: 'Products',
      value: productCount,
      icon: Package,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Customers',
      value: userCount,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2F2523]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#7B6D66]">
          Store operations overview for the Luna & Quartz demo.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[#E8E1D8] bg-white p-5 shadow-[0_12px_30px_rgba(74,50,39,0.05)] transition-all hover:shadow-[0_18px_45px_rgba(74,50,39,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#7B6D66]">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#2F2523]">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-[#E8E1D8] bg-white shadow-[0_12px_30px_rgba(74,50,39,0.05)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#E8E1D8] px-4 py-4 sm:px-6">
          <h2 className="text-base font-bold text-[#2F2523]">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#8F4F5B] hover:text-[#B76E79]"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-[#E8E1D8]">
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-[#7B6D66]">
              No orders yet
            </p>
          ) : (
            recentOrders.map((order) => {
              const status = getOrderStatusConfig(order.status)
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#FBF7F1] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="text-sm font-medium text-[#2F2523]">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7B6D66]">
                      {order.items.length} items ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-[#2F2523]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.style}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
