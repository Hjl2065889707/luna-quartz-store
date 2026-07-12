import { getPaginatedProductsByCategory } from '@/api-client/productApi.server'
import { getCategoryBySlug, productCategories } from '@/lib/categories'
import ItemCell from '@/components/ItemCell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { parsePageParam } from '@/lib/pagination'
import Pagination from '@/components/shop/Pagination'
import { createPageMetadata } from '@/lib/seo'

type CollectionPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
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
    return createPageMetadata({
      title: 'Collection not found',
      description: 'The requested crystal collection could not be found.',
      path: `/collections/${slug}`,
      noIndex: true,
    })
  }

  return createPageMetadata({
    title: category.name,
    description: category.seoDescription,
    path: `/collections/${category.slug}`,
  })
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = parsePageParam(page)
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { products, pagination } = await getPaginatedProductsByCategory({
    page: currentPage,
    pageSize: 8,
    category: category.dbValue,
  })

  return (
    <div className="bg-[#FBF7F1] py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#E8E1D8] bg-white px-6 py-8 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
            Collection
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2F2523] sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#7B6D66]">
            {category.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ItemCell item={product} key={product.id} />
          ))}
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          basePath={`/collections/${slug}`}
        />
      </div>
    </div>
  )
}
