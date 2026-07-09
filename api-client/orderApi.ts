import { CheckoutItem } from '@/types'

export const createCheckoutSession = async (
  items: CheckoutItem[],
  shippingInfo: {
    firstName: string
    lastName: string
    address: string
    phone: string
  },
): Promise<{ url: string }> => {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, shippingInfo }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || '创建支付失败')
  }
  return res.json()
}
