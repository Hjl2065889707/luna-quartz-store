import { getActiveProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import { siteConfig } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Shop Crystals | ${siteConfig.name}`,
  description:
    'Browse all crystal bracelets, tumbled stones, crystal points, ritual sets and suncatchers.',
}

export default async function ShopPage() {
  const products = await getActiveProducts()

  return (
    <div className="bg-stone-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
            Shop all
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
            Crystals for daily rituals and thoughtful gifting
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            Browse the full demo catalogue. Pagination will be added in the
            next learning step so this page can handle larger catalogues
            cleanly.
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
