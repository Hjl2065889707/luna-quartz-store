import { siteConfig } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `FAQ | ${siteConfig.name}`,
  description: 'Frequently asked questions for the Luna & Quartz demo store.',
}

const faqs = [
  {
    question: 'Is this a real store?',
    answer:
      'No. This is a portfolio demo that uses realistic product, cart, checkout and order flows without real fulfilment.',
  },
  {
    question: 'Are payments real?',
    answer:
      'No. Stripe is configured for test mode so the checkout flow can be demonstrated safely.',
  },
  {
    question: 'Are crystal meanings medical advice?',
    answer:
      'No. Any crystal meaning on this site is described as a traditional association or lifestyle note.',
  },
  {
    question: 'Why include these pages in a demo?',
    answer:
      'Real e-commerce projects need trust pages, policy pages and clear navigation, not only product cards.',
  },
]

export default function FaqPage() {
  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
          FAQ
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          Common questions
        </h1>
        <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
          {faqs.map((faq) => (
            <section key={faq.question} className="py-6">
              <h2 className="text-lg font-bold text-stone-950">
                {faq.question}
              </h2>
              <p className="mt-3 text-base leading-7 text-stone-600">
                {faq.answer}
              </p>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
