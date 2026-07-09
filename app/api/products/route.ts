import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  // 核心思想：条件对象先空着，有 query 才往里面塞过滤规则
  const whereCondition: Prisma.ProductWhereInput = { isActive: true }

  if (query) {
    whereCondition.name = { contains: query }
  }

  const products = await prisma.product.findMany({
    where: whereCondition,
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { name, price, image, description, category, stock } = await req.json()

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        image,
        description,
        category,
        stock,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('创建商品失败' + error, { status: 500 })
  }
}
