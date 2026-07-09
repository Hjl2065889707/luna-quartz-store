'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Truck, PackageCheck } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { getNextOrderStatus, ORDER_STATUS } from '@/lib/orderStatus'

const NEXT_ACTION: Record<
  string,
  { label: string; icon: typeof Truck }
> = {
  [ORDER_STATUS.PAID]: { label: '发货', icon: Truck },
  [ORDER_STATUS.SHIPPED]: { label: '确认送达', icon: PackageCheck },
}

const OrderStatusButton = ({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) => {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const action = NEXT_ACTION[currentStatus]
  const nextStatus = getNextOrderStatus(currentStatus)

  // DELIVERED、PENDING、REFUNDED 等状态没有下一步物流操作
  if (!action || !nextStatus) return null

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '操作失败')
      }
      router.refresh()
      showToast(`${action.label}成功`, 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = action.icon

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1.5 rounded-full bg-[#0064E0] px-3.5 py-1.5 text-xs font-medium text-white shadow-[0_2px_8px_rgba(0,100,224,0.25)] transition-all hover:bg-[#0143B5] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={14} />
      {isLoading ? '处理中...' : action.label}
    </button>
  )
}

export default OrderStatusButton
