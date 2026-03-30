import { Product } from '@/types'

export const getProduct = async (): Promise<Product[]> => {
  const res = await fetch('http://localhost:3000/api/products')
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

export const getSearchProducts = async (query: string): Promise<Product[]> => {
  const res = await fetch(
    `http://localhost:3000/api/products?q=${encodeURIComponent(query)}`,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}
