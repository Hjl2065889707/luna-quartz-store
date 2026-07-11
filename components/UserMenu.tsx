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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EEE6] text-[#2F2523] transition-colors hover:bg-[#E9D8DC] focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
      >
        <span className="text-[16px] font-bold tracking-tight">
          {name.charAt(0).toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-3xl bg-white shadow-[0_24px_70px_rgba(74,50,39,0.16)] ring-1 ring-[#E8E1D8] focus:outline-none">
          <div className="border-b border-[#E8E1D8] px-4 py-4">
            <p className="truncate text-[16px] font-medium text-[#2F2523]">
              {name}
            </p>
            <p className="truncate text-[14px] text-[#7B6D66]">{email}</p>
          </div>

          <div className="p-2">
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[14px] font-medium text-[#2F2523] transition-colors hover:bg-[#F4EEE6]"
            >
              <ShoppingBag size={16} />
              My orders
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[14px] font-medium text-[#C80A28] transition-colors hover:bg-[#F4EEE6]"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
