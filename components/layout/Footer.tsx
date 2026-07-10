import Link from 'next/link'
import { Gem } from 'lucide-react'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white">
              <Gem size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight text-stone-950">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Crystal gifts · Ritual pieces · AUD pricing
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-950">Collections</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="transition-colors hover:text-stone-950"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold text-stone-950">Information</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
            {siteConfig.footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-stone-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
