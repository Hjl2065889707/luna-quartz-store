import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getNextOrderStatus, ORDER_STATUS_LIST } from '@/lib/orderStatus'
import * as z from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_LIST),
})

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const validationResult = updateOrderStatusSchema.safeParse(await req.json())

  if (!validationResult.success) {
    return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
  }

  const { status } = validationResult.data

  // 查询当前订单
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // 校验状态转换是否合法
  if (getNextOrderStatus(order.status) !== status) {
    return NextResponse.json(
      { error: `Cannot change status from ${order.status} to ${status}` },
      { status: 400 },
    )
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
