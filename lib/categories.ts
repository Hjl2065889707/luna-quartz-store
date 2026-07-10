export type ProductCategorySlug =
  | 'bracelets'
  | 'tumbled-stones'
  | 'crystal-points'
  | 'crystal-sets'
  | 'suncatchers'

export type ProductCategoryConfig = {
  slug: ProductCategorySlug
  name: string
  dbValue: string
  description: string
  seoDescription: string
}

export const productCategories: ProductCategoryConfig[] = [
  {
    slug: 'bracelets',
    name: 'Bracelets',
    dbValue: 'Bracelets',
    description:
      'Everyday crystal bracelets designed for simple rituals, gifting and daily wear.',
    seoDescription:
      'Shop crystal bracelets in amethyst, rose quartz, citrine and more.',
  },
  {
    slug: 'tumbled-stones',
    name: 'Tumbled Stones',
    dbValue: 'Tumbled Stones',
    description:
      'Pocket-sized polished stones for bowls, desks, bedside tables and mindful routines.',
    seoDescription:
      'Browse polished tumbled stones for daily carry, home styling and crystal collections.',
  },
  {
    slug: 'crystal-points',
    name: 'Crystal Points',
    dbValue: 'Crystal Points',
    description:
      'Polished crystal towers and points for shelves, meditation corners and display styling.',
    seoDescription:
      'Discover polished crystal points and towers for mindful spaces and decor.',
  },
  {
    slug: 'crystal-sets',
    name: 'Crystal Sets',
    dbValue: 'Crystal Sets',
    description:
      'Curated crystal sets for beginners, self-care, protection and colourful rituals.',
    seoDescription:
      'Explore curated crystal sets for beginners, gifting and intentional routines.',
  },
  {
    slug: 'suncatchers',
    name: 'Suncatchers',
    dbValue: 'Suncatchers',
    description:
      'Light-catching crystal decor pieces made for sunny windows and gentle rainbow reflections.',
    seoDescription:
      'Shop crystal suncatchers for windows, bedrooms, studios and thoughtful gifts.',
  },
]

export const getCategoryBySlug = (slug: string) =>
  productCategories.find((category) => category.slug === slug)
