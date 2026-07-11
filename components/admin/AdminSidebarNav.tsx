'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, LayoutDashboard } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="no-scrollbar flex gap-2 overflow-x-auto p-4 lg:flex-1 lg:flex-col lg:gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-[#F4EEE6] text-[#8F4F5B] shadow-sm'
                : 'text-[#7B6D66] hover:bg-[#F4EEE6] hover:text-[#2F2523]'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
