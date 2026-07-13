'use client'

import { productCategories } from '@/lib/categories'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const getLinkClassName = (isActive: boolean) =>
  isActive
    ? 'font-bold text-charcoal-cocoa transition-colors hover:text-rose-clay'
    : 'font-medium text-soft-taupe transition-colors hover:text-charcoal-cocoa'

export default function DesktopNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-6 text-sm lg:flex">
      <Link href="/shop" className={getLinkClassName(pathname === '/shop')}>
        Shop
      </Link>
      {productCategories.slice(0, 3).map((category) => {
        const href = `/collections/${category.slug}`
        const isActive = pathname === href

        return (
          <Link
            key={category.slug}
            href={href}
            className={getLinkClassName(isActive)}
          >
            {category.name}
          </Link>
        )
      })}
    </nav>
  )
}
