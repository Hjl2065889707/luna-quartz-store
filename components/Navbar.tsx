import React from 'react'
import Cart from './Cart'
import SearchBar from './SearchBar'
import { Store } from 'lucide-react'

const Navbar = () => {
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
        <div className="flex items-center">
          <Cart />
        </div>
      </div>
    </header>
  )
}

export default Navbar
