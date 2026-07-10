import { getActiveProductsByCategory } from '@/api-client/productApi.server'
import { getCategoryBySlug, productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import ItemCell from '@/components/ItemCell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type CollectionPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: `Collection not found | ${siteConfig.name}`,
    }
  }

  return {
    title: `${category.name} | ${siteConfig.name}`,
    description: category.seoDescription,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getActiveProductsByCategory(category.dbValue)

  return (
    <div className="bg-stone-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
            Collection
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            {category.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ItemCell item={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
