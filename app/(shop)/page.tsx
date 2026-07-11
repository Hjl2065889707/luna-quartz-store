import { getActiveProducts } from '@/api-client/productApi.server'
import ItemCell from '@/components/ItemCell'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import { ArrowRight, Gift, HeartHandshake, PackageCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const products = await getActiveProducts()
  const featuredProducts = products.slice(0, 4)
  const heroProduct = products[0]
  const secondaryProduct = products[1]

  return (
    <div className="bg-[#FBF7F1]">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
            Australian boutique crystal demo
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight text-[#2F2523] sm:text-6xl">
            Gift-ready crystals for calm spaces and daily rituals.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#7B6D66]">
            {siteConfig.name} curates bracelets, tumbled stones, crystal points,
            ritual sets and suncatchers with a soft lifestyle storefront
            experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#2F2523] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#4A3732]"
            >
              Shop crystals
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/crystal-guide"
              className="inline-flex items-center rounded-full border border-[#D8CBBF] bg-white/50 px-6 py-3 text-sm font-bold text-[#2F2523] transition-colors hover:border-[#B76E79]"
            >
              Read the guide
            </Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[#E8E1D8] pt-6 text-sm text-[#7B6D66]">
            <span>Small catalogue</span>
            <span>AUD pricing</span>
            <span>Test checkout</span>
          </div>
        </div>

        <div className="relative min-h-[480px]">
          {heroProduct && (
            <div className="absolute right-0 top-0 h-[78%] w-[72%] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(74,50,39,0.16)]">
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
            <div className="absolute bottom-0 left-0 w-[52%] rounded-[1.5rem] border border-[#E8E1D8] bg-white p-4 shadow-[0_18px_50px_rgba(74,50,39,0.12)]">
              <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[#F4EEE6]">
                <Image
                  src={secondaryProduct.image}
                  alt={secondaryProduct.name}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#B76E79]">
                Featured piece
              </p>
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#2F2523]">
                {secondaryProduct.name}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
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
                className="flex gap-4 rounded-3xl bg-[#FBF7F1] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9D8DC] text-[#8F4F5B]">
                  <TrustIcon size={20} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#2F2523]">
                    {title as string}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#7B6D66]">
                    {body as string}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-[#FBF7F1] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
              Shop by collection
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2F2523]">
              Choose by how the piece fits your routine
            </h2>
            <p className="mt-4 text-base leading-7 text-[#7B6D66]">
              Browse a focused catalogue by wearable pieces, desk stones,
              display points, curated sets and window light catchers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group rounded-3xl border border-[#E8E1D8] bg-white p-6 transition hover:-translate-y-1 hover:border-[#D8CBBF] hover:shadow-[0_18px_45px_rgba(74,50,39,0.08)]"
              >
                <h3 className="text-base font-bold text-[#2F2523]">
                  {category.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#7B6D66]">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-[#B76E79]">
                  Explore
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B76E79]">
                Featured
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2F2523]">
                New pieces for quiet rituals
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden text-sm font-bold text-[#2F2523] underline-offset-4 hover:underline sm:inline"
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

      <section className="bg-[#2F2523] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C7B7D8]">
              Crystal guide
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Browse by intention, but keep it grounded.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#D8CBBF]">
              Crystal meanings in this demo are traditional associations and
              lifestyle notes. They help shoppers browse, gift and style pieces
              without making medical claims.
            </p>
          </div>
          <div className="flex items-center lg:justify-end">
            <Link
              href="/crystal-guide"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2F2523] transition hover:bg-[#FBF7F1]"
            >
              Read the guide
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
