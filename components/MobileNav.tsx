'use client'

import Cart from './Cart'
import SearchBar from './SearchBar'
import { productCategories } from '@/lib/categories'
import { siteConfig } from '@/lib/site'
import { Gem, Menu, Search, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'

type MobileNavProps = {
  user:
    | {
        name: string
        email: string
      }
    | null
}

const mainLinks = [
  { href: '/shop', label: 'Shop all' },
  { href: '/crystal-guide', label: 'Crystal guide' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping-returns', label: 'Shipping & returns' },
  { href: '/contact', label: 'Contact' },
]

export default function MobileNav({ user }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const shouldLockPage = isMenuOpen
    document.body.style.overflow = shouldLockPage ? 'hidden' : ''

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="lg:hidden">
      {isSearchOpen ? (
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-cocoa transition-colors hover:bg-mist-gray/40"
            aria-label="Close search"
          >
            <X size={22} />
          </button>
          <SearchBar
            autoFocus
            className="flex-1"
            onResultSelect={() => setIsSearchOpen(false)}
          />
        </div>
      ) : (
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-cocoa transition-colors hover:bg-mist-gray/40"
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
          >
            <Menu size={23} />
          </button>

          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 text-charcoal-cocoa"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-clay text-white shadow-sm">
              <Gem size={18} strokeWidth={2.5} />
            </span>
            <span className="max-w-[10rem] truncate text-lg font-serif font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-cocoa transition-colors hover:bg-mist-gray/40"
              aria-label="Search products"
            >
              <Search size={21} />
            </button>
            <Cart />
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal-cocoa/40 backdrop-blur-sm transition-opacity"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          />

          <aside
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${menuId}-title`}
            className="relative flex h-dvh w-[min(86vw,360px)] flex-col bg-warm-white shadow-[var(--shadow-boutique-heavy)] animate-in slide-in-from-left duration-300 ease-out"
          >
            <div className="flex items-center justify-between border-b border-mist-gray px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-clay text-white">
                  <Gem size={17} />
                </span>
                <div>
                  <p
                    id={`${menuId}-title`}
                    className="text-sm font-bold text-charcoal-cocoa"
                  >
                    {siteConfig.name}
                  </p>
                  <p className="text-xs text-soft-taupe">Crystal boutique</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-cocoa transition-colors hover:bg-mist-gray/40 -mr-2"
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-2xl px-4 py-3 text-base font-bold text-charcoal-cocoa transition-colors hover:bg-moon-ivory hover:text-rose-clay"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-mist-gray pt-6">
                <p className="px-4 text-xs font-bold uppercase tracking-widest text-rose-clay">
                  Collections
                </p>
                <div className="mt-3 space-y-1">
                  {productCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/collections/${category.slug}`}
                      onClick={closeMenu}
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-soft-taupe transition-colors hover:bg-moon-ivory hover:text-charcoal-cocoa"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="border-t border-mist-gray bg-moon-ivory p-6">
              {user ? (
                <div className="space-y-4">
                  <div>
                    <p className="truncate text-sm font-bold text-charcoal-cocoa">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-soft-taupe">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/account/orders"
                    onClick={closeMenu}
                    className="flex w-full justify-center rounded-full bg-charcoal-cocoa px-4 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-charcoal-cocoa/90"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full justify-center rounded-full border border-mist-gray bg-warm-white px-4 py-3.5 text-sm font-bold text-charcoal-cocoa transition-colors hover:bg-mist-gray/20"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex justify-center rounded-full border border-mist-gray bg-warm-white px-4 py-3.5 text-center text-sm font-bold text-charcoal-cocoa transition-colors hover:bg-mist-gray/20"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="flex justify-center rounded-full bg-charcoal-cocoa px-4 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-charcoal-cocoa/90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
