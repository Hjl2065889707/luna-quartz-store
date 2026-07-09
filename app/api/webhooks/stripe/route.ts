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
    console.log('支付成功！Session ID:', session.id)

    const { userId, shippingInfo, items } = session.metadata!
    const shipping = JSON.parse(shippingInfo)
    const orderItems = JSON.parse(items)

    await prisma.$transaction(async (tx) => {
      // 去重
      const existingOrder = await tx.order.findUnique({
        where: { stripeSessionId: session.id },
      })

      if (existingOrder) return

      // 扣库存
      for (const item of orderItems) {
        // 用updateMany的结果获取是否成功的扣减库存（如果为0则扣减失败）
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        })
        if (updated.count !== 1) {
          // 库存不足创建对应订单，状态为退款
          throw new Error(`Insufficient stock for product ${item.productId}`)
        }
      }
      // 创建订单
      await tx.order.create({
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
              (item: {
                productId: string
                quantity: number
                price: number
              }) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              }),
            ),
          },
          status: 'PAID',
        },
      })
    })
  }

  // 第三步：返回 200 告诉 Stripe "我收到了"
  return NextResponse.json({ received: true })
}
