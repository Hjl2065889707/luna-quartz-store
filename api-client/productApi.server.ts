import { prisma } from '@/lib/prisma'

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return products
}
