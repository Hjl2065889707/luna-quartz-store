# Luna & Quartz

Luna & Quartz is a portfolio-ready full-stack e-commerce demo built with Next.js, TypeScript, Prisma, Postgres and Stripe. It simulates a boutique crystal storefront with product browsing, category pages, pagination, cart, checkout, user orders, admin workflows, SEO and production-style deployment.

> This is a demo project for portfolio and learning purposes. It does not process real fulfilment, shipping or customer support.

## Live Demo

```txt
https://luna-quartz-store.vercel.app
```

The primary portfolio demo is deployed on Vercel with Neon Postgres for faster global access. A self-hosted Tencent Cloud VPS deployment is also maintained separately for Linux, Nginx, PM2 and HTTPS deployment practice.

Admin credentials are not published in this repository. They can be provided privately for controlled demos.

## Highlights

- Full-stack implementation with Next.js App Router, React, TypeScript and Route Handlers.
- Storefront information architecture with landing page, shop, collections, product detail, FAQ, shipping, contact and crystal guide pages.
- Stripe Checkout test-mode integration with signed webhook handling.
- Idempotent order creation, server-side checkout validation and transactional stock deduction.
- Admin product and order management with protected routes.
- SEO foundation with metadata, canonical URLs, Open Graph, Twitter cards, sitemap.xml, robots.txt and Product JSON-LD.
- Responsive storefront UI with mobile drawer navigation, search overlay and mobile checkout flow.
- Production-style deployment using Vercel, Neon Postgres, environment variables and a separate self-hosted VPS deployment.
- Product images optimized to WebP for a smaller repository and faster page loads.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- Neon Postgres for the primary demo database
- NextAuth / Auth.js credentials login
- Stripe Checkout and Stripe webhooks
- React Hook Form and Zod
- Tailwind CSS
- SWR
- Vercel, Neon Postgres, Nginx, PM2 and Tencent Cloud CVM

## Features

### Storefront

- Editorial home page
- `/shop` product listing with pagination
- `/collections/[slug]` category pages with pagination
- `/product/[id]` product detail pages
- Search dropdown with clickable product results
- Persisted cart state
- Checkout and success / processing / refunded states
- User order history

### Admin

- `/admin` dashboard
- Product creation, editing and active/inactive management
- Runtime image upload is supported in the self-hosted VPS deployment and disabled in the Vercel demo until object storage is configured
- Order list
- Order status updates: `PAID -> SHIPPED -> DELIVERED`

### Payment Flow

- The client sends a cart snapshot to the checkout API.
- The server validates the request body with Zod.
- The server reloads product records from the database and validates product IDs, names, prices, quantities, stock and active status.
- Stripe Checkout sessions are created from server-validated data.
- Redirect URLs are generated from `NEXT_PUBLIC_SITE_URL`, avoiding localhost redirects behind reverse proxies.
- Stripe webhooks are verified with the endpoint signing secret.
- Webhook handling performs idempotency checks and stock deduction inside a database transaction.
- If stock is no longer available after payment, the demo records a refunded order state and creates a test-mode refund path.

## SEO

Implemented SEO foundations:

- Site URL configuration via `NEXT_PUBLIC_SITE_URL`
- Root `metadataBase`
- Title templates
- Page-level metadata helper
- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- `/robots.txt`
- `/sitemap.xml`
- Product JSON-LD on product detail pages
- Product image alt text

Relevant files:

- `lib/site.ts`
- `lib/seo.ts`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/(shop)/product/[id]/page.tsx`

## Local Development

Install dependencies:

```bash
pnpm install
```

Create `.env` from `.env.example` and fill in the required values:

```bash
cp .env.example .env
```

Prepare the database:

```bash
pnpm prisma generate
pnpm prisma db push
pnpm seed
```

Start the development server:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

Required values:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=verify-full"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-local-secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

SEED_ADMIN_EMAIL="replace-with-demo-admin-email"
SEED_ADMIN_PASSWORD="replace-with-strong-demo-admin-password"

ENABLE_LOCAL_UPLOADS="false"
```

For deployment, update the public URLs to the production HTTPS domain:

```env
NEXT_PUBLIC_SITE_URL="https://shop.example.com"
NEXTAUTH_URL="https://shop.example.com"
NEXT_PUBLIC_API_BASE_URL="https://shop.example.com"
```

## Useful Commands

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
pnpm seed
pnpm update-product-images
pnpm update-admin-user
```

Use `pnpm update-admin-user` to rotate the demo admin account without reseeding the database. The seed script resets demo data, so it should not be used on a live demo unless resetting orders and products is intentional.

## Deployment Notes

- The primary public demo runs on Vercel with Neon Postgres.
- A self-hosted Tencent Cloud CVM version is kept for Linux, Nginx, PM2 and HTTPS deployment practice.
- Stripe API and webhook delivery require stable outbound and inbound network connectivity.
- Runtime uploads are disabled in the Vercel demo because serverless deployments should not rely on local filesystem persistence.
- The self-hosted VPS deployment can keep local `public/uploads` for controlled demos.
- A real production serverless system should use object storage such as Cloudflare R2, S3 or Vercel Blob with a CDN.
- Admin credentials and secrets are configured through environment variables and are not committed to the repository.
- Public demos should not expose writable admin credentials permanently.

## Validation Status

Before handoff, the project was validated with:

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
```

Manual checks completed:

- Vercel live demo access
- `/robots.txt`
- `/sitemap.xml`
- Product metadata and Product JSON-LD
- Stripe test checkout
- Stripe webhook order creation on the Vercel endpoint
- User order history
- Admin order and product management
- Mobile navigation, search, cart and checkout success page

## Portfolio Summary

```txt
Built and deployed a portfolio-ready e-commerce storefront with Next.js, TypeScript, Prisma, Postgres and Stripe, including landing pages, collection-based browsing, paginated product listing, persisted cart state, authenticated checkout, webhook-based order processing, atomic stock updates, refund handling, admin product/order management, technical SEO, WebP image optimization, Vercel deployment with Neon Postgres, and a separate self-hosted VPS deployment with Nginx, HTTPS and PM2.
```

## Future Improvements

- Add focused tests for checkout and Stripe webhook handling.
- Store order item snapshots for product name and image at purchase time.
- Persist Stripe `paymentIntentId` and `refundId`.
- Add related products to product detail pages.
- Move runtime image uploads to object storage such as Cloudflare R2, S3 or Vercel Blob.
- Rebuild the backend with C# / ASP.NET Core Web API as a future learning project.
