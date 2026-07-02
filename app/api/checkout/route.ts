import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userSession = await getServerSession(authOptions)
    if (!userSession?.user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product?.name ?? '商品'} 库存不足` },
          { status: 400 },
        )
      }
    }

    const lineItems = body.items.map((item: any) => {
      return {
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // 调用 Stripe SDK 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout`,
      metadata: {
        userId: userSession.user.id,
        shippingInfo: JSON.stringify(body.shippingInfo),
        items: JSON.stringify(body.items),
      },
    })
    // 把 Stripe 生成的支付页面 URL 返回给前端
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('创建支付失败：', error)
    return NextResponse.json({ error: '创建支付失败' }, { status: 500 })
  }
}
