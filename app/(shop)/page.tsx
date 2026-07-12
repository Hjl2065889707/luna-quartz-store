import { getActiveProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import { ArrowRight, Gift, HeartHandshake, PackageCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: `${siteConfig.name} | Crystal Store Demo`,
  description: siteConfig.description,
  path: '/',
})

export default async function Home() {
  const products = await getActiveProducts()
  const featuredProducts = products.slice(0, 4)
  const heroProduct = products[0]
  const secondaryProduct = products[1]

  return (
    <div className="bg-moon-ivory">
      {/* Hero Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 py-14 duration-1000 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="max-w-2xl">
          <p className="text-rose-clay text-sm font-semibold tracking-widest uppercase">
            Australian boutique crystal demo
          </p>
          <h1 className="text-charcoal-cocoa mt-5 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
            Gift-ready crystals for calm spaces and daily rituals.
          </h1>
          <p className="text-soft-taupe mt-6 text-lg leading-relaxed">
            {siteConfig.name} curates bracelets, tumbled stones, crystal points,
            ritual sets and suncatchers with a soft lifestyle storefront
            experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Shop crystals
            </Button>
            <Button href="/crystal-guide" variant="outline" size="lg">
              Read the guide
            </Button>
          </div>
          <div className="border-mist-gray text-soft-taupe mt-10 flex w-full items-center justify-center gap-4 border-t pt-6 text-sm font-medium">
            <span>Small catalogue</span>
            <span className="bg-mist-gray h-1 w-1 shrink-0 rounded-full"></span>
            <span>AUD pricing</span>
            <span className="bg-mist-gray h-1 w-1 shrink-0 rounded-full"></span>
            <span>Test checkout</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr] lg:relative lg:block lg:min-h-[480px]">
          {heroProduct && (
            <div className="bg-warm-white relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-boutique-heavy)] transition-transform duration-700 hover:scale-[1.02] lg:absolute lg:top-0 lg:right-0 lg:h-[78%] lg:w-[72%]">
              <Image
                src={heroProduct.image}
                alt={`${heroProduct.name} featured crystal product`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
                priority
              />
            </div>
          )}
          {secondaryProduct && (
            <div className="border-mist-gray bg-warm-white bg-warm-white/95 rounded-[1.5rem] border p-4 shadow-[var(--shadow-boutique-hover)] backdrop-blur-sm sm:self-end lg:absolute lg:bottom-0 lg:left-0 lg:w-[52%]">
              <div className="bg-mist-gray/30 relative aspect-square overflow-hidden rounded-[1rem]">
                <Image
                  src={secondaryProduct.image}
                  alt={`${secondaryProduct.name} featured crystal product`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="260px"
                />
              </div>
              <p className="text-rose-clay mt-4 text-xs font-semibold tracking-widest uppercase">
                Featured piece
              </p>
              <p className="text-charcoal-cocoa mt-1 line-clamp-1 text-sm font-semibold">
                {secondaryProduct.name}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Values Section */}
      <section className="bg-warm-white border-mist-gray/50 animate-in fade-in slide-in-from-bottom-8 fill-mode-both border-y py-12 delay-200 duration-1000">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            [
              PackageCheck,
              'Packed with care',
              'Designed around a realistic boutique order experience.',
            ],
            [
              Gift,
              'Gift-ready catalogue',
              'Bracelets, sets and suncatchers for everyday gifting.',
            ],
            [
              HeartHandshake,
              'Grounded meanings',
              'Traditional crystal notes without medical claims.',
            ],
          ].map(([Icon, title, body]) => {
            const TrustIcon = Icon as typeof PackageCheck
            return (
              <div
                key={title as string}
                className="bg-moon-ivory/50 hover:bg-moon-ivory flex gap-5 rounded-2xl p-6 transition-colors"
              >
                <span className="bg-rose-clay/10 text-deep-rose flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <TrustIcon size={22} strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-charcoal-cocoa text-base font-bold">
                    {title as string}
                  </h2>
                  <p className="text-soft-taupe mt-1.5 text-sm leading-relaxed">
                    {body as string}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-moon-ivory py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-700">
            <p className="text-rose-clay text-sm font-semibold tracking-widest uppercase">
              Shop by collection
            </p>
            <h2 className="text-charcoal-cocoa mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              Choose by how the piece fits your routine
            </h2>
            <p className="text-soft-taupe mt-4 text-lg leading-relaxed">
              Browse a focused catalogue by wearable pieces, desk stones,
              display points, curated sets and window light catchers.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {productCategories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group border-mist-gray bg-warm-white hover:border-rose-clay/30 rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-boutique-hover)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-charcoal-cocoa text-lg font-bold">
                  {category.name}
                </h3>
                <p className="text-soft-taupe mt-3 line-clamp-3 text-sm leading-relaxed">
                  {category.description}
                </p>
                <span className="text-rose-clay group-hover:text-deep-rose mt-6 inline-flex text-sm font-bold transition-colors">
                  Explore{' '}
                  <ArrowRight
                    size={16}
                    className="ml-1 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-warm-white border-mist-gray border-t py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-rose-clay text-sm font-semibold tracking-widest uppercase">
                Featured
              </p>
              <h2 className="text-charcoal-cocoa mt-3 font-serif text-4xl tracking-tight">
                New pieces for quiet rituals
              </h2>
            </div>
            <Button
              href="/shop"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Shop all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((item) => (
              <ItemCell item={item} key={item.id} />
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:hidden">
            <Button href="/shop" variant="outline" size="lg" className="w-full">
              Shop all
            </Button>
          </div>
        </div>
      </section>

      {/* Guide CTA Section */}
      <section className="bg-charcoal-cocoa text-warm-white relative overflow-hidden py-20">
        {/* Subtle background decoration */}
        <div className="bg-mist-gray absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full opacity-5 blur-3xl"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:px-8">
          <div>
            <p className="text-lavender-quartz text-sm font-semibold tracking-widest uppercase">
              Crystal guide
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              Browse by intention, but keep it grounded.
            </h2>
            <p className="text-mist-gray/80 mt-6 max-w-2xl text-lg leading-relaxed">
              Crystal meanings in this demo are traditional associations and
              lifestyle notes. They help shoppers browse, gift and style pieces
              without making medical claims.
            </p>
          </div>
          <div className="mt-6 flex items-center lg:mt-0 lg:justify-end">
            <Button href="/crystal-guide" variant="secondary" size="lg">
              Read the guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
