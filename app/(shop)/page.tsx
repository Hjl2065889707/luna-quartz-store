import { getActiveProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import { ArrowRight, Gift, HeartHandshake, PackageCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default async function Home() {
  const products = await getActiveProducts()
  const featuredProducts = products.slice(0, 4)
  const heroProduct = products[0]
  const secondaryProduct = products[1]

  return (
    <div className="bg-moon-ivory">
      {/* Hero Section */}
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-clay">
            Australian boutique crystal demo
          </p>
          <h1 className="mt-5 text-5xl font-serif leading-tight tracking-tight text-charcoal-cocoa sm:text-6xl">
            Gift-ready crystals for calm spaces and daily rituals.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-soft-taupe">
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
          <div className="mt-10 flex w-full justify-center items-center gap-4 border-t border-mist-gray pt-6 text-sm text-soft-taupe font-medium">
            <span>Small catalogue</span>
            <span className="h-1 w-1 rounded-full bg-mist-gray shrink-0"></span>
            <span>AUD pricing</span>
            <span className="h-1 w-1 rounded-full bg-mist-gray shrink-0"></span>
            <span>Test checkout</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr] lg:relative lg:block lg:min-h-[480px]">
          {heroProduct && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-warm-white shadow-[var(--shadow-boutique-heavy)] lg:absolute lg:right-0 lg:top-0 lg:h-[78%] lg:w-[72%] transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src={heroProduct.image}
                alt={heroProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
                priority
              />
            </div>
          )}
          {secondaryProduct && (
            <div className="rounded-[1.5rem] border border-mist-gray bg-warm-white p-4 shadow-[var(--shadow-boutique-hover)] sm:self-end lg:absolute lg:bottom-0 lg:left-0 lg:w-[52%] backdrop-blur-sm bg-warm-white/95">
              <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-mist-gray/30">
                <Image
                  src={secondaryProduct.image}
                  alt={secondaryProduct.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="260px"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rose-clay">
                Featured piece
              </p>
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-charcoal-cocoa">
                {secondaryProduct.name}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Values Section */}
      <section className="bg-warm-white py-12 border-y border-mist-gray/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
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
                className="flex gap-5 rounded-2xl bg-moon-ivory/50 p-6 transition-colors hover:bg-moon-ivory"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-clay/10 text-deep-rose">
                  <TrustIcon size={22} strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-charcoal-cocoa">
                    {title as string}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-soft-taupe">
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
          <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-clay">
              Shop by collection
            </p>
            <h2 className="mt-4 text-4xl font-serif tracking-tight text-charcoal-cocoa sm:text-5xl">
              Choose by how the piece fits your routine
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-soft-taupe">
              Browse a focused catalogue by wearable pieces, desk stones,
              display points, curated sets and window light catchers.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {productCategories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group rounded-3xl border border-mist-gray bg-warm-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-clay/30 hover:shadow-[var(--shadow-boutique-hover)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-bold text-charcoal-cocoa">
                  {category.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-soft-taupe">
                  {category.description}
                </p>
                <span className="mt-6 inline-flex text-sm font-bold text-rose-clay group-hover:text-deep-rose transition-colors">
                  Explore <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-warm-white py-20 border-t border-mist-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-clay">
                Featured
              </p>
              <h2 className="mt-3 text-4xl font-serif tracking-tight text-charcoal-cocoa">
                New pieces for quiet rituals
              </h2>
            </div>
            <Button href="/shop" variant="ghost" className="hidden sm:inline-flex">
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
      <section className="bg-charcoal-cocoa py-20 text-warm-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-mist-gray opacity-5 blur-3xl"></div>
        
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:px-8 relative z-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lavender-quartz">
              Crystal guide
            </p>
            <h2 className="mt-4 text-4xl font-serif tracking-tight sm:text-5xl">
              Browse by intention, but keep it grounded.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist-gray/80">
              Crystal meanings in this demo are traditional associations and
              lifestyle notes. They help shoppers browse, gift and style pieces
              without making medical claims.
            </p>
          </div>
          <div className="flex items-center lg:justify-end mt-6 lg:mt-0">
            <Button href="/crystal-guide" variant="secondary" size="lg">
              Read the guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
