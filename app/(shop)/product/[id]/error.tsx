'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Product page render failed:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-[#FBF7F1] px-4 text-center">
      <AlertCircle className="mb-6 h-12 w-12 text-red-500" />
      <h2 className="mb-4 text-2xl font-bold text-[#2F2523]">
        Something went wrong
      </h2>
      <p className="mb-8 max-w-md text-[#7B6D66]">
        The product page could not be loaded. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-full bg-[#2F2523] px-8 py-3 font-bold text-white transition-all hover:bg-[#4A3732]"
      >
        Try again
      </button>
    </div>
  )
}
