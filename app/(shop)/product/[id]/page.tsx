import { getActiveProductById } from '@/api-client/productApi.server'
import { notFound } from 'next/navigation'
import ProductPageLayout from './ProductPageLayout'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import { Metadata } from 'next'
import { formatCurrency } from '@/lib/formatters'
import { siteConfig } from '@/lib/site'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getActiveProductById(id)
  if (!product) {
    return { title: `Product not found | ${siteConfig.name}` }
  }
  return {
    title: `${product.name} | ${siteConfig.name}`,
    description: product.description,
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params
  const product = await getActiveProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <ProductPageLayout
      imageSlot={
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority // 详情页大图必须加 priority 优化首屏加载
          />
        </div>
      }
      infoSlot={
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-black text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4">
            <span className="text-3xl font-bold text-zinc-900">
              {formatCurrency(product.price)}
            </span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-zinc-500">
            {product.description}
          </p>
          <div className="mt-8 border-t border-zinc-100 pt-8">
            <p className="mb-4 text-sm text-zinc-500">
              Availability:{' '}
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>
      }
    />
  )
}

export default ProductPage
