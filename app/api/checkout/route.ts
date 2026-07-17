import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  CheckoutItemSnapshot,
  checkoutRequestSchema,
} from '@/lib/schemas/checkout'
import { siteConfig } from '@/lib/site'

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
      return NextResponse.json({ error: 'Please sign in first' }, { status: 401 })
    }

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
          { error: `${product.name} does not have enough stock` },
          { status: 409 },
        )
      }
      if (product.price !== item.price) {
        return NextResponse.json(
          { error: `${product.name} price has changed. Please review your cart.` },
          { status: 409 },
        )
      }
      if (product.name !== item.name) {
        return NextResponse.json(
          { error: `${product.name} details have changed. Please review your cart.` },
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
    const siteUrl = siteConfig.url

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        userId: userSession.user.id,
        shippingInfo: JSON.stringify(validationResult.data.shippingInfo),
        items: JSON.stringify(checkoutItems),
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
