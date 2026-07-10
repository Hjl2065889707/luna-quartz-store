import { getActiveProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const products = await getActiveProducts()
  const featuredProducts = products.slice(0, 4)
  const heroProduct = products[0]

  return (
    <div className="bg-stone-50">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
            Curated crystal essentials
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-stone-950 sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            A calm crystal shop for bracelets, tumbled stones, polished points,
            ritual sets and light-catching suncatchers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-700"
            >
              Shop crystals
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/crystal-guide"
              className="inline-flex items-center rounded-full border border-stone-300 px-5 py-3 text-sm font-bold text-stone-900 transition-colors hover:border-stone-900"
            >
              Read the guide
            </Link>
          </div>
        </div>

        {heroProduct && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-xl shadow-stone-200/70">
            <Image
              src={heroProduct.image}
              alt={heroProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        )}
      </section>

      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
                Shop by collection
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
                Find the format that fits your routine
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden text-sm font-bold text-stone-900 underline-offset-4 hover:underline sm:inline"
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="rounded-lg border border-stone-200 bg-stone-50 p-5 transition-colors hover:border-stone-400 hover:bg-white"
              >
                <h3 className="text-base font-bold text-stone-950">
                  {category.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
                Featured
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
                New pieces for quiet rituals
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden text-sm font-bold text-stone-900 underline-offset-4 hover:underline sm:inline"
            >
              Shop all
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((item) => (
              <ItemCell item={item} key={item.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            [
              'Carefully packed',
              'Pieces are presented with gifting, display and everyday rituals in mind.',
            ],
            [
              'AUD pricing',
              'Prices are shown in Australian dollars for a local storefront feel.',
            ],
            [
              'Small catalogue',
              'A focused crystal catalogue keeps browsing simple and intentional.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="border-t border-stone-200 pt-6">
              <h2 className="text-lg font-bold text-stone-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
