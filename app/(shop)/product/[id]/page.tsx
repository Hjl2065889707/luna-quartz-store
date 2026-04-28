import { getProductById } from '@/api-client/productApi'
import { notFound } from 'next/navigation'
import ProductPageLayout from './ProductPageLayout'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) {
    return { title: '商品未找到 | Antigravity Store' }
  }
  return {
    title: `${product.name} | Antigravity Store`,
    description: product.description,
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params
  const product = await getProductById(id)

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
              ¥{product.price}
            </span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-zinc-500">
            {product.description}
          </p>
          <div className="mt-8 border-t border-zinc-100 pt-8">
            <p className="mb-4 text-sm text-zinc-500">
              库存状态：
              {product.stock > 0 ? `有货 (${product.stock}件)` : '缺货'}
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>
      }
    />
  )
}

export default ProductPage
