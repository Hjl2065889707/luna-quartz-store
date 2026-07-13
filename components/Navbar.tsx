import React from 'react'
import Cart from './Cart'
import MobileNav from './MobileNav'
import SearchBar from './SearchBar'
import { Gem } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import AuthNav from './AuthNav'
import DesktopNavLinks from './DesktopNavLinks'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-mist-gray">
      {/* Absolute background element to prevent backdrop-filter from creating a containing block for the fixed MobileNav overlay */}
      <div className="absolute inset-0 -z-10 bg-warm-white/90 backdrop-blur-md" />

      <div className="relative truncate bg-charcoal-cocoa px-4 py-2 text-center text-xs font-medium tracking-wide text-moon-ivory">
        Free demo shipping · Stripe test checkout
      </div>
      <MobileNav />
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

          <DesktopNavLinks />
        </div>

        <div className="flex flex-1 items-center justify-end px-8">
          <SearchBar />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <Cart />
          <AuthNav />
        </div>
      </div>
    </header>
  )
}

export default Navbar
