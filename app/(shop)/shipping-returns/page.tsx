import { siteConfig } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Shipping & Returns | ${siteConfig.name}`,
  description:
    'Shipping, returns and demo checkout information for Luna & Quartz.',
}

const policies = [
  {
    title: 'Demo checkout only',
    body: 'Stripe runs in test mode in this project. Payments are simulated and no real fulfilment happens.',
  },
  {
    title: 'Shipping concept',
    body: 'A real Australian store would normally show delivery regions, dispatch times, shipping rates and tracking rules here.',
  },
  {
    title: 'Returns concept',
    body: 'A production store should explain change-of-mind returns, damaged item reporting, refund timing and customer support steps.',
  },
]

export default function ShippingReturnsPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
          Information
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          Shipping & Returns
        </h1>
        <div className="mt-10 space-y-6">
          {policies.map((policy) => (
            <section
              key={policy.title}
              className="border-t border-stone-200 pt-6"
            >
              <h2 className="text-lg font-bold text-stone-950">
                {policy.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-stone-600">
                {policy.body}
              </p>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
