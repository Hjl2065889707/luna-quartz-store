import { prisma } from '@/lib/prisma'

export const getActiveProducts = async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return products
}

export const getActiveProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
  })

  return product
}

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return products
}
