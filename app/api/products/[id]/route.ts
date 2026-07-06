import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    })
  } catch (error) {
    console.error('删除商品失败', error)
    return new NextResponse('Product not found', { status: 404 })
  }
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  try {
    const body = await req.json()
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('更新商品失败', error)
    return new NextResponse('Product not found', { status: 404 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params
  const { name, description, category, price, stock, image } = await req.json()

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, category, price, stock, image },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('更新商品失败', error)
    return new NextResponse('更新商品失败', { status: 500 })
  }
}
