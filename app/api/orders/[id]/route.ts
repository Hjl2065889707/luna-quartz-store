import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

interface RouteParams {
  params: Promise<{ id: string }>
}

// 状态机：只允许单向推进
const VALID_TRANSITIONS: Record<string, string> = {
  PAID: 'SHIPPED',
  SHIPPED: 'DELIVERED',
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '无权限' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  // 查询当前订单
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 })
  }

  // 校验状态转换是否合法
  if (VALID_TRANSITIONS[order.status] !== status) {
    return NextResponse.json(
      { error: `不能从 ${order.status} 变为 ${status}` },
      { status: 400 },
    )
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
