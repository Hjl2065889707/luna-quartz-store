import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { CreateOrderBody } from '@/types'
import { Order } from '@prisma/client'
import { getServerSession } from 'next-auth'

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

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return []
    }
    const orders = await prisma.order.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return orders
  } catch (error) {
    console.error('获取订单失败', error)
    return []
  }
}
