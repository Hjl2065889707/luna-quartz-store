import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { CreateOrderBody } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }

    const body: CreateOrderBody = await req.json()

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phone: body.phone,
        totalAmount: body.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        items: {
          create: body.items,
        },
      },
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('订单创建失败', error)
    return NextResponse.json({ error: '订单创建失败' }, { status: 500 })
  }
}
