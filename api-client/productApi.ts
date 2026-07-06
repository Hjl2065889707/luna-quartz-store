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

export const deleteProductById = async (id: string) => {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete product')
  }
  return res.json()
}

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || '图片上传失败')
  }
  return res.json()
}

export const createProduct = async (
  data: Record<string, unknown>,
): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || '创建商品失败')
  }
  return res.json()
}

export const updateProduct = async (
  id: string,
  data: Record<string, unknown>,
): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || '更新商品失败')
  }
  return res.json()
}
