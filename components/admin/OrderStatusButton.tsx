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
  [ORDER_STATUS.PAID]: { label: 'Mark shipped', icon: Truck },
  [ORDER_STATUS.SHIPPED]: { label: 'Mark delivered', icon: PackageCheck },
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
        throw new Error(data.error || 'Action failed')
      }
      router.refresh()
      showToast(`${action.label} successfully`, 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = action.icon

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1.5 rounded-full bg-[#2F2523] px-3.5 py-1.5 text-xs font-medium text-white shadow-[0_8px_18px_rgba(74,50,39,0.18)] transition-all hover:bg-[#4A3732] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={14} />
      {isLoading ? 'Updating...' : action.label}
    </button>
  )
}

export default OrderStatusButton
