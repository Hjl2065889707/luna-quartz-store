import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import {
  CheckoutFormValues,
  CheckoutItemSnapshot,
  checkoutItemSnapshotSchema,
  checkoutSchema,
} from '@/lib/schemas/checkout'
import { ORDER_STATUS } from '@/lib/orderStatus'
import type { Prisma } from '@prisma/client'

class InsufficientStockError extends Error {
  constructor(readonly productId: string) {
    super(`Insufficient stock for product ${productId}`)
    this.name = 'InsufficientStockError'
  }
}

const parseSessionMetadata = (metadata: Stripe.Metadata | null) => {
  if (!metadata?.userId || !metadata.shippingInfo || !metadata.items) {
    throw new Error('Stripe session metadata is incomplete')
  }

  return {
    userId: metadata.userId,
    shipping: checkoutSchema.parse(JSON.parse(metadata.shippingInfo)),
    orderItems: checkoutItemSnapshotSchema
      .array()
      .parse(JSON.parse(metadata.items)),
  }
}

const getPaymentIntentId = (
  paymentIntent: string | Stripe.PaymentIntent | null,
) => {
  if (typeof paymentIntent === 'string') return paymentIntent
  return paymentIntent?.id ?? null
}

const calculateTotalAmount = (orderItems: CheckoutItemSnapshot[]) =>
  orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

const createOrderItems = (orderItems: CheckoutItemSnapshot[]) =>
  orderItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }))

const createPaidOrder = async ({
  tx,
  sessionId,
  userId,
  shipping,
  orderItems,
}: {
  tx: Prisma.TransactionClient
  sessionId: string
  userId: string
  shipping: CheckoutFormValues
  orderItems: CheckoutItemSnapshot[]
}) => {
  // webhook 可能被 Stripe 重试，也可能因为网络问题重复投递。
  // 订单表里的 stripeSessionId 是唯一键；这里先查一次，让重复事件直接结束。
  const existingOrder = await tx.order.findUnique({
    where: { stripeSessionId: sessionId },
  })

  if (existingOrder) return

  // 这里用 updateMany 是为了把“检查库存”和“扣库存”合成一个数据库操作。
  // 如果库存已经不够，where 条件匹配不到记录，updated.count 就会是 0。
  for (const item of orderItems) {
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
      throw new InsufficientStockError(item.productId)
    }
  }

  await tx.order.create({
    data: {
      userId,
      stripeSessionId: sessionId,
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      address: shipping.address,
      phone: shipping.phone,
      totalAmount: calculateTotalAmount(orderItems),
      items: {
        create: createOrderItems(orderItems),
      },
      status: ORDER_STATUS.PAID,
    },
  })
}

const createRefundedOrder = async ({
  sessionId,
  userId,
  shipping,
  orderItems,
}: {
  sessionId: string
  userId: string
  shipping: CheckoutFormValues
  orderItems: CheckoutItemSnapshot[]
}) => {
  await prisma.order.upsert({
    where: { stripeSessionId: sessionId },
    update: {},
    create: {
      userId,
      stripeSessionId: sessionId,
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      address: shipping.address,
      phone: shipping.phone,
      totalAmount: calculateTotalAmount(orderItems),
      items: {
        create: createOrderItems(orderItems),
      },
      status: ORDER_STATUS.REFUNDED,
    },
  })
}

const refundPaymentAndRecordOrder = async ({
  session,
  userId,
  shipping,
  orderItems,
}: {
  session: Stripe.Checkout.Session
  userId: string
  shipping: CheckoutFormValues
  orderItems: CheckoutItemSnapshot[]
}) => {
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  })

  if (existingOrder) return

  const paymentIntentId = getPaymentIntentId(session.payment_intent)

  if (!paymentIntentId) {
    throw new Error(`Missing payment intent for Stripe session ${session.id}`)
  }

  // 不要把 Stripe API 调用放进数据库事务里。
  // 退款是外部网络请求；用 Stripe idempotency key 保证 webhook 重试时不会重复退款。
  await stripe.refunds.create(
    { payment_intent: paymentIntentId },
    { idempotencyKey: `refund_${session.id}` },
  )

  await createRefundedOrder({
    sessionId: session.id,
    userId,
    shipping,
    orderItems,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text() // 注意：必须用 text() 而不是 json()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

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

    const { userId, shipping, orderItems } = parseSessionMetadata(
      session.metadata,
    )

    try {
      await prisma.$transaction(async (tx) => {
        await createPaidOrder({
          tx,
          sessionId: session.id,
          userId,
          shipping,
          orderItems,
        })
      })
    } catch (error) {
      if (error instanceof InsufficientStockError) {
        console.error('库存不足，准备自动退款：', {
          sessionId: session.id,
          productId: error.productId,
        })

        await refundPaymentAndRecordOrder({
          session,
          userId,
          shipping,
          orderItems,
        })

        return NextResponse.json({ received: true, refunded: true })
      }

      throw error
    }
  }

  // 第三步：返回 200 告诉 Stripe "我收到了"
  return NextResponse.json({ received: true })
}
