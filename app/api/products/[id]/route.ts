import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  // Next.js 15+ 中，params 是一个 Promise
  const { id } = await params

  // 这里是真正的后端，可以直接查库
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return new NextResponse('Product not found', { status: 404 })
  }

  return NextResponse.json(product)
}
