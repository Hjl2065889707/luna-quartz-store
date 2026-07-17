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
  // Stripe may retry webhook delivery, so session IDs are handled idempotently.
  const existingOrder = await tx.order.findUnique({
    where: { stripeSessionId: sessionId },
  })

  if (existingOrder) return

  // Combine the stock check and decrement into one atomic database operation.
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

  // Keep the external Stripe refund request outside the database transaction.
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
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log('Checkout session completed:', session.id)

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
        console.error('Insufficient stock, refunding payment:', {
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

  return NextResponse.json({ received: true })
}
