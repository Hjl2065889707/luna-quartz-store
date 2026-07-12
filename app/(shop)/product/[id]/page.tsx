import { getActiveProductById } from '@/api-client/productApi.server'
import { notFound } from 'next/navigation'
import ProductPageLayout from './ProductPageLayout'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import { Metadata } from 'next'
import { formatCurrency } from '@/lib/formatters'
import Link from 'next/link'
import { createPageMetadata } from '@/lib/seo'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getActiveProductById(id)
  if (!product) {
    return createPageMetadata({
      title: 'Product not found',
      description: 'The requested crystal product could not be found.',
      path: `/product/${id}`,
      noIndex: true,
    })
  }
  return createPageMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.id}`,
    image: product.image,
  })
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
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-[#E8E1D8] bg-white shadow-[0_24px_70px_rgba(74,50,39,0.12)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      }
      infoSlot={
        <div className="flex flex-col justify-center rounded-[2rem] border border-[#E8E1D8] bg-white p-6 sm:p-8 lg:p-10">
          <Link
            href={`/collections/${product.category.toLowerCase().replaceAll(' ', '-')}`}
            className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]"
          >
            {product.category}
          </Link>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[#2F2523] sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4">
            <span className="text-3xl font-bold text-[#2F2523]">
              {formatCurrency(product.price)}
            </span>
          </div>
          <p className="mt-6 text-lg leading-8 text-[#7B6D66]">
            {product.description}
          </p>

          <div className="mt-8 grid gap-3 border-y border-[#E8E1D8] py-6 text-sm text-[#7B6D66] sm:grid-cols-2">
            <p>
              <span className="font-semibold text-[#2F2523]">Availability:</span>{' '}
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Out of stock'}
            </p>
            <p>
              <span className="font-semibold text-[#2F2523]">Currency:</span>{' '}
              AUD
            </p>
            <p>
              <span className="font-semibold text-[#2F2523]">Demo:</span>{' '}
              Stripe test checkout
            </p>
            <p>
              <span className="font-semibold text-[#2F2523]">Care:</span>{' '}
              Packed with care
            </p>
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 rounded-3xl bg-[#FBF7F1] p-5 text-sm leading-6 text-[#7B6D66]">
            <p className="font-semibold text-[#2F2523]">Crystal note</p>
            <p className="mt-2">
              Meanings are traditional associations and lifestyle notes, not
              medical advice. This portfolio demo does not process real
              fulfilment.
            </p>
          </div>
        </div>
      }
    />
  )
}

export default ProductPage
