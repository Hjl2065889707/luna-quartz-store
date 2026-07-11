import Link from 'next/link'
import { Gem } from 'lucide-react'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'

const Footer = () => {
  return (
    <footer className="border-t border-[#E8E1D8] bg-[#2F2523] text-[#FBF7F1]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B76E79] text-white">
              <Gem size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#D8CBBF]">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#C7B7D8]">
            Crystal gifts · Ritual pieces · AUD pricing
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Collections</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-[#D8CBBF]">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="transition-colors hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Information</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-[#D8CBBF]">
            {siteConfig.footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
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
