export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  REFUNDED: 'REFUNDED',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const ORDER_STATUS_LIST = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAID,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.REFUNDED,
] as const

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    style: string
  }
> = {
  PENDING: { label: 'Pending', style: 'bg-amber-50 text-amber-700' },
  PAID: { label: 'Paid', style: 'bg-emerald-50 text-emerald-700' },
  SHIPPED: { label: 'Shipped', style: 'bg-blue-50 text-blue-700' },
  DELIVERED: { label: 'Delivered', style: 'bg-purple-50 text-purple-700' },
  REFUNDED: { label: 'Refunded', style: 'bg-stone-100 text-stone-600' },
}

export const getOrderStatusConfig = (status: string) => {
  return (
    ORDER_STATUS_CONFIG[status as OrderStatus] ?? {
      label: status,
      style: 'bg-gray-50 text-gray-700',
    }
  )
}

export const ORDER_STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> =
  {
    PAID: ORDER_STATUS.SHIPPED,
    SHIPPED: ORDER_STATUS.DELIVERED,
  }

export const getNextOrderStatus = (status: string) =>
  ORDER_STATUS_TRANSITIONS[status as OrderStatus] ?? null
