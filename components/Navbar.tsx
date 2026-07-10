import React from 'react'
import Cart from './Cart'
import SearchBar from './SearchBar'
import { Gem } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import UserMenu from './UserMenu'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { productCategories } from '@/lib/categories'

const Navbar = async () => {
  // 服务端极速捞取用户的登录态（不耗费任何客户端性能）
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex cursor-pointer items-center gap-2 text-stone-950 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm">
              <Gem size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 lg:flex">
            <Link href="/shop" className="font-bold text-stone-950 transition-colors">
              Shop
            </Link>
            {productCategories.slice(0, 3).map((category) => (
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

        <div className="flex flex-1 items-center justify-end px-4 lg:px-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
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
                className="hidden text-sm font-medium text-stone-800 hover:underline md:block"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hidden h-9 items-center justify-center rounded-full bg-stone-900 px-4 text-sm font-bold text-white transition-all hover:bg-stone-700 md:flex"
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
