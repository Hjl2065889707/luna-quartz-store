import { CreateOrderBody } from '@/types'

export const createOrder = async (
  data: CreateOrderBody,
): Promise<{ orderId: string }> => {
  const res = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create order')
  }
  return res.json()
}
