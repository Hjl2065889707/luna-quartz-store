import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Order } from '@prisma/client'
import { getServerSession } from 'next-auth'

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return []
    }
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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

export const getOrderBySessionId = async (
  session_id: string,
): Promise<Order | null> => {
  const order = await prisma.order.findUnique({
    where: {
      stripeSessionId: session_id,
    },
  })
  return order
}
