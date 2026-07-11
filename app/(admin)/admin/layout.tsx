import Link from 'next/link'
import { Gem, LogOut } from 'lucide-react'
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav'
import { siteConfig } from '@/lib/site'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FBF7F1] lg:flex">
      <aside className="z-40 flex flex-col border-b border-[#E8E1D8] bg-[#FFFDF9] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-20 items-center gap-3 border-b border-[#E8E1D8] px-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B76E79] text-white shadow-[0_10px_25px_rgba(143,79,91,0.22)]">
            <Gem size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2F2523]">
              {siteConfig.name}
            </p>
            <p className="text-xs text-[#7B6D66]">Admin workspace</p>
          </div>
        </div>

        <AdminSidebarNav />

        <div className="hidden border-t border-[#E8E1D8] p-4 lg:block">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#7B6D66] transition-all hover:bg-[#F4EEE6] hover:text-[#2F2523]"
          >
            <LogOut size={18} />
            Back to storefront
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:ml-64 lg:p-8">{children}</main>
    </div>
  )
}
