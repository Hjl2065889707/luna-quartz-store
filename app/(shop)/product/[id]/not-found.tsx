import Link from 'next/link'
import { PackageX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FBF7F1] px-4 text-center">
      <div className="mb-6 rounded-full bg-[#F4EEE6] p-6">
        <PackageX className="h-12 w-12 text-[#B76E79]" />
      </div>
      <h2 className="mb-4 text-3xl font-black tracking-tight text-[#2F2523]">
        Product not found
      </h2>
      <p className="mb-8 text-lg text-[#7B6D66]">
        This item may be inactive or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#2F2523] px-8 py-3.5 font-bold text-white transition-all hover:bg-[#4A3732]"
      >
        Back to storefront
      </Link>
    </div>
  )
}
