'use client'

import React, { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface UserMenuProps {
  name: string
  email: string
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-gray/40 text-charcoal-cocoa transition-colors hover:bg-mist-gray/80 focus:outline-none focus:ring-2 focus:ring-rose-clay focus:ring-offset-2 focus:ring-offset-warm-white"
      >
        <span className="text-[16px] font-bold tracking-tight">
          {name.charAt(0).toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-3xl bg-warm-white shadow-[var(--shadow-boutique-heavy)] border border-mist-gray focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-mist-gray bg-moon-ivory px-5 py-4 rounded-t-3xl">
            <p className="truncate text-base font-bold text-charcoal-cocoa">
              {name}
            </p>
            <p className="truncate text-sm text-soft-taupe mt-0.5">{email}</p>
          </div>

          <div className="p-2">
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-charcoal-cocoa transition-colors hover:bg-moon-ivory hover:text-rose-clay"
            >
              <ShoppingBag size={18} className="text-soft-taupe" />
              My orders
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-deep-rose transition-colors hover:bg-rose-clay/10 mt-1"
            >
              <LogOut size={18} className="text-deep-rose" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
