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

type GetPaginatedProductsParams = {
  page: number
  pageSize: number
}

export const getPaginatedProducts = async ({
  page,
  pageSize,
}: GetPaginatedProductsParams) => {
  const where = { isActive: true }

  const totalItems = await prisma.product.count({
    where,
  })

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const skip = (currentPage - 1) * pageSize

  const products = await prisma.product.findMany({
    where,
    take: pageSize,
    skip,
    orderBy: { createdAt: 'desc' },
  })

  return {
    products,
    pagination: {
      page: currentPage,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

type GetPaginatedProductsByCategoryParams = {
  page: number
  pageSize: number
  category: string
}

export const getPaginatedProductsByCategory = async ({
  page,
  pageSize,
  category,
}: GetPaginatedProductsByCategoryParams) => {
  const where = { isActive: true, category }

  const totalItems = await prisma.product.count({
    where,
  })

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const skip = (currentPage - 1) * pageSize

  const products = await prisma.product.findMany({
    where,
    take: pageSize,
    skip,
    orderBy: { createdAt: 'desc' },
  })

  return {
    products,
    pagination: {
      page: currentPage,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}
