import React from 'react'
import Cart from './Cart'
import SearchBar from './SearchBar'
import { Store } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import UserMenu from './UserMenu'
import Link from 'next/link'

const Navbar = async () => {
  // 服务端极速捞取用户的登录态（不耗费任何客户端性能）
  const session = await getServerSession(authOptions)

  return (
    // Sticky positioning + Glassmorphism (blur) + Subtle border
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo + Nav */}
        <div className="flex items-center gap-8">
          {/* Logo Section */}
          <div className="flex cursor-pointer items-center gap-2 text-zinc-900 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
              <Store size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">Antigravity Store</span>
          </div>

          {/* Navigation Links (Mock) */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-500 lg:flex">
            <a href="#" className="font-bold text-zinc-900 transition-colors">所有商品(All)</a>
            <a href="#" className="transition-colors hover:text-zinc-900">服饰(Clothing)</a>
            <a href="#" className="transition-colors hover:text-zinc-900">生活(Lifestyle)</a>
          </nav>
        </div>

        {/* Search Bar Container - Takes flexible width */}
        <div className="flex flex-1 items-center justify-end px-4 lg:px-8">
          <SearchBar />
        </div>

        {/* Actions Context */}
        <div className="flex items-center gap-4">
          <Cart />
          
          {/* 破茧成蝶：如果有 session 显示用户菜单，没有则显示登录按钮 */}
          {session?.user ? (
            <UserMenu 
              name={session.user.name || 'User'} 
              email={session.user.email || ''} 
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login"
                className="hidden md:block text-sm font-medium text-[#1C2B33] hover:underline"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hidden md:flex h-9 items-center justify-center rounded-full bg-[#0064E0] px-4 text-sm font-bold text-white transition-all hover:bg-[#0143B5]"
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
