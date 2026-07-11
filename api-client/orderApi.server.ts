import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Prisma, Order } from '@prisma/client'
import { getServerSession } from 'next-auth'

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } }
}>

export const getUserOrders = async (): Promise<OrderWithItems[]> => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return []
  }

  try {
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
    console.error('Failed to fetch user orders', error)
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
