import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text() // 注意：必须用 text() 而不是 json()
  const signature = req.headers.get('stripe-signature')!

  let event

  // 第一步：验签
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook 签名验证失败', err)
    return NextResponse.json({ error: '签名无效' }, { status: 400 })
  }

  // 第二步：只处理 checkout.session.completed 事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object // 这就是 Stripe Checkout Session 对象
    console.log('✅ 支付成功！Session ID:', session.id)

    // TODO: 在这里创建订单（下一步做）
    const { userId, shippingInfo, items } = session.metadata!
    const shipping = JSON.parse(shippingInfo)
    const orderItems = JSON.parse(items)
    const order = await prisma.order.create({
      data: {
        userId: userId,
        stripeSessionId: session.id,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address: shipping.address,
        phone: shipping.phone,
        totalAmount: orderItems.reduce(
          (sum: number, item: { price: number; quantity: number }) =>
            sum + item.price * item.quantity,
          0,
        ),
        items: {
          create: orderItems.map(
            (item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }),
          ),
        },
        status: 'PAID',
      },
    })
  }

  // 第三步：返回 200 告诉 Stripe "我收到了"
  return NextResponse.json({ received: true })
}
