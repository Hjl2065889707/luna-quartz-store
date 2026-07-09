import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  CheckoutItemSnapshot,
  checkoutRequestSchema,
} from '@/lib/schemas/checkout'

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const validationResult = checkoutRequestSchema.safeParse(json)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          issues: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const userSession = await getServerSession(authOptions)
    if (!userSession?.user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 })
    }

    // 商品信息校验（金额/库存/名称等）
    const checkoutItems: CheckoutItemSnapshot[] = []

    for (const item of validationResult.data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (!product || !product.isActive) {
        return NextResponse.json(
          {
            error:
              'Some items are no longer available. Please review your cart.',
          },
          { status: 409 },
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} 库存不足` },
          { status: 409 },
        )
      }
      if (product.price !== item.price) {
        return NextResponse.json(
          { error: `${product.name} 的价格已更新，请重新下单` },
          { status: 409 },
        )
      }
      if (product.name !== item.name) {
        return NextResponse.json(
          { error: `${product.name} 的内容可能已更新，请重新下单` },
          { status: 409 },
        )
      }
      checkoutItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      })
    }

    const lineItems = checkoutItems.map((item) => {
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
        shippingInfo: JSON.stringify(validationResult.data.shippingInfo),
        items: JSON.stringify(checkoutItems),
      },
    })
    // 把 Stripe 生成的支付页面 URL 返回给前端
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('创建支付失败：', error)
    return NextResponse.json({ error: '创建支付失败' }, { status: 500 })
  }
}
