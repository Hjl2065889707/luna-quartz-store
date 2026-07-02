import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Store,
} from 'lucide-react'
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F1F4F7]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#DEE3E9] bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-[#DEE3E9] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0064E0] text-white shadow-[0_4px_14px_rgba(0,100,224,0.3)]">
            <Store size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1C2B33]">
              Antigravity Store
            </p>
            <p className="text-xs text-[#5D6C7B]">Admin Panel</p>
          </div>
        </div>

        {/* Nav Links - Client Component for pathname */}
        <AdminSidebarNav />

        {/* Bottom */}
        <div className="border-t border-[#DEE3E9] p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5D6C7B] transition-all hover:bg-[#F1F4F7] hover:text-[#1C2B33]"
          >
            <LogOut size={18} />
            返回商城
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  )
}
