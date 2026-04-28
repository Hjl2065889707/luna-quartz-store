import Link from 'next/link'
import { PackageX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-zinc-100 p-6">
        <PackageX className="h-12 w-12 text-zinc-400" />
      </div>
      <h2 className="mb-4 text-3xl font-black tracking-tight text-zinc-900">
        商品未找到
      </h2>
      <p className="mb-8 text-lg text-zinc-500">
        抱歉，您要寻找的商品可能已经下架或链接有误。
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-8 py-3.5 font-bold text-white transition-all hover:bg-zinc-800"
      >
        返回浏览更多好物
      </Link>
    </div>
  )
}
