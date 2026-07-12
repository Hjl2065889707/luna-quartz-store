import type { Metadata } from 'next'
import { siteConfig } from './site'

type CreatePageMetadataParams = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

const defaultOgImage = '/products/rose-quartz-heart-bracelet.webp'

export const toAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${siteConfig.url}${normalizedPath}`
}

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  type = 'website',
  noIndex = false,
}: CreatePageMetadataParams): Metadata {
  const canonicalUrl = toAbsoluteUrl(path)
  const imageUrl = toAbsoluteUrl(image)
  const socialTitle =
    title === siteConfig.name || title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: 'en_AU',
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}

type ProductJsonLdProduct = {
  id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  stock: number
}

export function createProductJsonLd(product: ProductJsonLdProduct) {
  const productUrl = toAbsoluteUrl(`/product/${product.id}`)
  const imageUrl = toAbsoluteUrl(product.image)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [imageUrl],
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: siteConfig.currency,
      price: product.price.toFixed(2),
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
