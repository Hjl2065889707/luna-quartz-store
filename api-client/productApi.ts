import { Product } from '@/types'

/**
 * 客户端专用的 API Client 函数。
 * 仅供 Client Component（如 SearchBar）使用。
 * Server Component 应直接导入数据源，而非调用自己的 API。
 *
 * 未来切换 C# .NET 后端时，只需修改此文件中的 URL 即可。
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
)

const apiUrl = (path: string) => `${API_BASE_URL}${path}`

export const searchProducts = async (query: string): Promise<Product[]> => {
  const res = await fetch(apiUrl(`/api/products?q=${encodeURIComponent(query)}`))
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  return res.json()
}

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(apiUrl('/api/upload'), {
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
  const res = await fetch(apiUrl('/api/products'), {
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
  const res = await fetch(apiUrl(`/api/products/${id}`), {
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
