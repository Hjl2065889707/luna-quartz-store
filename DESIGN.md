# Luna & Quartz Design System

## 1. Brand Direction

Luna & Quartz is a boutique crystal storefront, not a technology showroom. The interface should feel like a small independent lifestyle brand: calm, tactile, giftable, lightly editorial, and trustworthy. It should avoid both overly mystical visuals and cold SaaS minimalism.

The visual goal is:

```text
soft boutique retail
  + natural materials
  + curated gifting
  + calm wellness language
  + clear ecommerce usability
```

Reference patterns:

- Crystal shops often group navigation around jewellery, suncatchers, crystal sets, tumbles, points and crystal meanings.
- A realistic independent shop homepage usually includes hero, featured collections, best sellers, trust reasons, testimonials or guide content, and newsletter/support information.
- Marketplace pages such as Etsy are useful for density, filters and category chips, but this project should feel more curated than marketplace-like.

## 2. Visual Atmosphere

Use warm, refined surfaces with enough contrast that the site still feels modern and professional.

### Keywords

- Moonlit
- Mineral
- Polished
- Gentle
- Gift-ready
- Editorial
- Australian boutique

### Avoid

- Tech-store blue as the dominant accent
- Heavy black-and-white minimalism
- Purple gradient spirituality cliches
- Beige-only palettes
- Overly decorative blobs, orbs or fantasy visuals
- Dense marketplace clutter on the landing page

## 3. Color System

### Core

- **Moon Ivory** `#FBF7F1`: main warm page background
- **Warm White** `#FFFFFF`: cards and content surfaces
- **Charcoal Cocoa** `#2F2523`: primary text and dark buttons
- **Soft Taupe** `#7B6D66`: secondary text
- **Mist Gray** `#E8E1D8`: borders and dividers

### Accents

- **Rose Clay** `#B76E79`: refined lifestyle accent
- **Deep Rose** `#8F4F5B`: hover/active accent
- **Sage** `#7D9271`: trust, calm and stock indicators
- **Lavender Quartz** `#C7B7D8`: subtle collection highlight
- **Honey Citrine** `#D9A441`: small warm emphasis

### Usage

- Use Charcoal Cocoa for primary CTA buttons.
- Use Rose Clay sparingly for chips, small labels and selected states.
- Use Sage for reassuring notes like packed with care, Australian demo, in stock.
- Use Moon Ivory as broad background, but break it with white sections so the page does not become one-note beige.

## 4. Typography

Use the existing system font stack. Do not introduce external Google Fonts because deployment may happen on Tencent Cloud.

### Style

- Headings: medium-heavy, calm, not shouty.
- Body: readable, generous line height.
- Labels: small uppercase, but avoid excessive letter spacing.
- Product names: clear and scannable.

### Scale

- Hero: `48px-64px`, `font-black` or `font-bold`
- Section headings: `30px-40px`
- Product card title: `15px-17px`, `font-semibold`
- Body copy: `15px-18px`, relaxed line height
- Meta labels: `12px-13px`, uppercase or small caps

## 5. Layout Principles

### Homepage

The homepage is a guided storefront, not a complete catalogue.

Required sections:

- Hero with real product image and strong brand signal.
- Collection cards for bracelets, tumbled stones, points, sets and suncatchers.
- Featured products, limited to a small curated set.
- Trust strip: carefully packed, AUD pricing, test checkout demo.
- Crystal guide teaser.

### Product Listing

Listing pages should be calm and scannable:

- Editorial page header.
- Product count.
- Responsive product grid.
- Product cards with stable image ratio.
- Pagination below the grid.

### Product Detail

Product pages should answer:

- What is it?
- What does it cost?
- Is it in stock?
- What is it traditionally associated with?
- Can I safely add it to cart?
- What does this demo do and not do?

## 6. Components

### Product Cards

Product cards should feel like boutique retail tiles:

- Warm white surface.
- Stable image container.
- Subtle border.
- Minimal shadow.
- Category chip.
- Product name, short description, price.
- Add-to-cart control that does not dominate the card.
- Low-stock note only when useful.

### Buttons

- Primary: dark cocoa pill button.
- Secondary: outlined pill button.
- Icon buttons: circular, clear hover state.
- Disabled: muted warm gray.

### Navigation

- Sticky, warm white, subtle border.
- Brand should be clear in the first viewport.
- Keep nav labels short.
- Search and cart should remain functional, but not visually overpower the brand.

### Pagination

- Centered, compact, accessible.
- Use page numbers with `aria-current="page"`.
- Use links for navigable pages.
- Use muted non-interactive elements for unavailable previous/next.

## 7. Content Voice

Use grounded lifestyle language:

```text
calm routines
gift-ready pieces
desk, bedside and window styling
traditional associations
```

Avoid strong claims:

```text
cures anxiety
heals illness
guarantees energy protection
```

Use disclaimers where needed:

```text
Crystal meanings are traditional associations and lifestyle notes, not medical advice.
```
