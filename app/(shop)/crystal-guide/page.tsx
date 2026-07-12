import { productCategories } from '@/lib/categories'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Crystal Guide',
  description:
    'A beginner-friendly guide to browsing crystal bracelets, tumbled stones, points, sets and suncatchers.',
  path: '/crystal-guide',
})

export default function CrystalGuidePage() {
  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
          Crystal guide
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          Choose by format, intention and how the piece fits your space
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-600">
          Crystal meanings are presented as traditional associations, not
          medical or scientific claims. For this demo store, the guide helps
          shoppers browse by use case and product format.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-400"
            >
              <h2 className="text-lg font-bold text-stone-950">
                {category.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
