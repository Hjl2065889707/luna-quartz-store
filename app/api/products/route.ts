import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
