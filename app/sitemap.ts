import type { MetadataRoute } from 'next'
import { getActiveProducts } from '@/api-client/productApi.server'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'

const createUrl = (path: string) => new URL(path, siteConfig.url).toString()

const staticRoutes = [
  '/',
  '/shop',
  '/about',
  '/crystal-guide',
  '/shipping-returns',
  '/faq',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: createUrl(route),
    lastModified: now,
    changeFrequency: route === '/' || route === '/shop' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/shop' ? 0.9 : 0.6,
  }))

  const collectionEntries: MetadataRoute.Sitemap = productCategories.map(
    (category) => ({
      url: createUrl(`/collections/${category.slug}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  )

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: createUrl(`/product/${product.id}`),
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
