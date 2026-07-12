import { getPaginatedProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import Pagination from '@/components/shop/Pagination'
import { parsePageParam } from '@/lib/pagination'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Shop Crystals',
  description:
    'Browse all crystal bracelets, tumbled stones, crystal points, ritual sets and suncatchers.',
  path: '/shop',
})

type ShopPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { page } = await searchParams
  const currentPage = parsePageParam(page)

  const { products, pagination } = await getPaginatedProducts({
    page: currentPage,
    pageSize: 8,
  })

  return (
    <div className="bg-[#FBF7F1] py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#E8E1D8] bg-white px-6 py-8 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
            Shop all
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-[#2F2523] sm:text-5xl">
            Crystals for daily rituals and thoughtful gifting
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#7B6D66]">
            Browse bracelets, tumbled stones, crystal points, sets and
            suncatchers in a focused demo catalogue.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ItemCell item={product} key={product.id} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#7B6D66]">
          Showing {products.length} of {pagination.totalItems} products
        </p>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          basePath="/shop"
        />
      </div>
    </div>
  )
}
