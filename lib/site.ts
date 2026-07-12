export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '')

export const siteConfig = {
  name: 'Luna & Quartz',
  shortName: 'L&Q',
  description:
    'A portfolio crystal store demo for curated bracelets, tumbled stones, crystal points, ritual sets and suncatchers.',
  url: siteUrl,
  contactEmail: 'hello@lunaandquartz.example',
  currency: 'AUD',
  mainNav: [
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/collections/bracelets' },
    { label: 'Crystal Guide', href: '/crystal-guide' },
    { label: 'About', href: '/about' },
  ],
  footerNav: [
    { label: 'About', href: '/about' },
    { label: 'Shipping & Returns', href: '/shipping-returns' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
} as const
