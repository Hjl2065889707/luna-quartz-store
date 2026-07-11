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

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E1D8] bg-[#FFFDF9]/90 backdrop-blur-md">
      <div className="truncate bg-[#2F2523] px-4 py-2 text-center text-xs font-medium text-[#FBF7F1]">
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
            className="flex min-w-0 cursor-pointer items-center gap-2 text-[#2F2523] transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B76E79] text-white shadow-sm">
              <Gem size={18} strokeWidth={2.5} />
            </div>
            <span className="max-w-[9.5rem] truncate text-base font-bold tracking-tight sm:max-w-none sm:text-lg">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#7B6D66] lg:flex">
            <Link
              href="/shop"
              className="font-bold text-[#2F2523] transition-colors"
            >
              Shop
            </Link>
            {productCategories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="transition-colors hover:text-[#2F2523]"
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
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-[#2F2523] hover:underline md:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hidden h-9 items-center justify-center rounded-full bg-[#2F2523] px-4 text-sm font-bold text-white transition-all hover:bg-[#4A3732] md:flex"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
