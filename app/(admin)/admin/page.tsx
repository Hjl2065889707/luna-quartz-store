import { prisma } from '@/lib/prisma'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

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
      label: '总收入',
      value: `$${(totalRevenue._sum.totalAmount ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: '订单数',
      value: orderCount,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-[#0064E0]',
    },
    {
      label: '商品数',
      value: productCount,
      icon: Package,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: '用户数',
      value: userCount,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C2B33]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#5D6C7B]">
          欢迎回来，这里是你的商城运营概览。
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#DEE3E9] bg-white p-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_12px_28px_0_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#5D6C7B]">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1C2B33]">
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

      {/* Recent Orders */}
      <div className="rounded-2xl border border-[#DEE3E9] bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-[#DEE3E9] px-6 py-4">
          <h2 className="text-base font-bold text-[#1C2B33]">最近订单</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#0064E0] hover:text-[#0143B5]"
          >
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-[#DEE3E9]">
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-[#5D6C7B]">
              暂无订单
            </p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#F7F8FA]"
              >
                <div>
                  <p className="text-sm font-medium text-[#1C2B33]">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="mt-0.5 text-xs text-[#5D6C7B]">
                    {order.items.length} 件商品 ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#1C2B33]">
                    ${order.totalAmount}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      order.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.status === 'SHIPPED'
                          ? 'bg-blue-50 text-[#0064E0]'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
