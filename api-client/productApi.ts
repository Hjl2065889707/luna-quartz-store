import { Product } from '@/types'

/**
 * 客户端专用的 API Client 函数。
 * 仅供 Client Component（如 SearchBar）使用。
 * Server Component 应直接导入数据源，而非调用自己的 API。
 *
 * 未来切换 C# .NET 后端时，只需修改此文件中的 URL 即可。
 */

export const getProducts = async (): Promise<Product[]> => {
  // 必须使用绝对路径，假装它是一个外部的 C# 服务器
  const res = await fetch(`http://localhost:3000/api/products`)
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const res = await fetch(`http://localhost:3000/api/products/${id}`)

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to fetch product details')
  }
  return res.json()
}
