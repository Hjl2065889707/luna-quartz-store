export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  REFUNDED: 'REFUNDED',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    style: string
  }
> = {
  PENDING: { label: '待支付', style: 'bg-amber-50 text-amber-700' },
  PAID: { label: '已支付', style: 'bg-emerald-50 text-emerald-700' },
  SHIPPED: { label: '已发货', style: 'bg-blue-50 text-[#0064E0]' },
  DELIVERED: { label: '已送达', style: 'bg-purple-50 text-purple-700' },
  REFUNDED: { label: '已退款', style: 'bg-zinc-100 text-zinc-600' },
}

export const getOrderStatusConfig = (status: string) => {
  return (
    ORDER_STATUS_CONFIG[status as OrderStatus] ?? {
      label: status,
      style: 'bg-gray-50 text-gray-700',
    }
  )
}
