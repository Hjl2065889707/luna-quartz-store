import { siteConfig } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description:
    'Learn about the story and design goals behind the Luna & Quartz crystal store demo.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
          About
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          A calm crystal store experience built as a full-stack portfolio demo
        </h1>
        <div className="mt-8 space-y-6 text-base leading-8 text-stone-600">
          <p>
            {siteConfig.name} is a fictional boutique crystal store created to
            demonstrate a realistic e-commerce flow with Next.js, TypeScript,
            Prisma and Stripe test mode.
          </p>
          <p>
            The storefront focuses on a small curated catalogue: crystal
            bracelets, tumbled stones, polished points, ritual sets and
            suncatchers. The goal is to feel like a real independent store while
            keeping the product and fulfilment flow safe for demo use.
          </p>
          <p>
            Orders, payments and refunds are handled in test mode only. No real
            products are shipped from this demo.
          </p>
        </div>
      </section>
    </div>
  )
}
