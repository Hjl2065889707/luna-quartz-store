import { siteConfig } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description: 'Contact information for the Luna & Quartz demo store.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600">
          This is a demo contact page for a portfolio project. In a production
          store, this page would usually connect to a support inbox, CRM or
          transactional email provider.
        </p>

        <div className="mt-10 border-t border-stone-200 pt-8">
          <h2 className="text-lg font-bold text-stone-950">Demo email</h2>
          <p className="mt-3 text-base text-stone-600">
            {siteConfig.contactEmail}
          </p>
        </div>
      </section>
    </div>
  )
}
