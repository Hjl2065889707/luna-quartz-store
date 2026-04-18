'use client'

import React, { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'

interface UserMenuProps {
  name: string
  email: string
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 极简的点外面关闭下拉菜单的逻辑
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
      {/* 头像触发器 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F4F7] text-[#1C2B33] transition-colors hover:bg-[#DEE3E9] focus:outline-none focus:ring-2 focus:ring-[#0064E0]"
      >
        <span className="text-[16px] font-bold tracking-tight">
          {name.charAt(0).toUpperCase()}
        </span>
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-[16px] bg-white shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-4 border-b border-[#DEE3E9]">
            <p className="text-[16px] font-medium text-[#1C2B33] truncate">
              {name}
            </p>
            <p className="text-[14px] text-[#65676B] truncate">{email}</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-[14px] font-medium text-[#E41E3F] transition-colors hover:bg-[#F1F4F7]"
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
