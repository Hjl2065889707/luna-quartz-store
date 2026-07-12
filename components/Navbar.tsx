import React from 'react'
import Cart from './Cart'
import MobileNav from './MobileNav'
import SearchBar from './SearchBar'
import { Gem } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import UserMenu from './UserMenu'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { productCategories } from '@/lib/categories'
import { Button } from './ui/Button'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-mist-gray">
      {/* Absolute background element to prevent backdrop-filter from creating a containing block for the fixed MobileNav overlay */}
      <div className="absolute inset-0 -z-10 bg-warm-white/90 backdrop-blur-md" />
      
      <div className="relative truncate bg-charcoal-cocoa px-4 py-2 text-center text-xs font-medium tracking-wide text-moon-ivory">
        Free demo shipping · Stripe test checkout
      </div>
      <MobileNav
        user={
          session?.user
            ? {
                name: session.user.name || 'User',
                email: session.user.email || '',
              }
            : null
        }
      />
      <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between px-8 lg:flex">
        <div className="flex min-w-0 shrink-0 items-center gap-8">
          <Link
            href="/"
            className="group flex min-w-0 cursor-pointer items-center gap-3 text-charcoal-cocoa transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-clay text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Gem size={18} strokeWidth={2.5} />
            </div>
            <span className="max-w-[9.5rem] truncate text-lg font-serif font-bold tracking-tight sm:max-w-none">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-soft-taupe lg:flex">
            <Link
              href="/shop"
              className="font-bold text-charcoal-cocoa transition-colors hover:text-rose-clay"
            >
              Shop
            </Link>
            {productCategories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="transition-colors hover:text-charcoal-cocoa"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end px-8">
          <SearchBar />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <Cart />

          {session?.user ? (
            <UserMenu
              name={session.user.name || 'User'}
              email={session.user.email || ''}
            />
          ) : (
            <div className="flex items-center gap-3">
              <Button href="/login" variant="ghost" size="sm" className="hidden md:flex">
                Log in
              </Button>
              <Button href="/signup" variant="primary" size="sm" className="hidden md:flex">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
