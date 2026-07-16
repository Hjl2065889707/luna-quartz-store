# Project Roadmap

This file tracks the remaining public-facing improvement ideas for Luna & Quartz.
Internal learning notes and deployment checklists are kept out of the public repository.

## Current Status

The project is portfolio-ready as a full-stack e-commerce demo.

- Primary demo: `https://luna-quartz-store.vercel.app`
- Primary deployment: Vercel + Neon Postgres
- Secondary deployment: Tencent Cloud CVM, Nginx, PM2 and HTTPS for self-hosting practice
- Stripe test checkout and webhook order creation have been validated
- Admin credentials are managed through environment variables and are not published

## Completed

- Next.js App Router storefront with landing page, shop, collections and product detail pages
- Responsive crystal boutique UI with mobile drawer navigation and search overlay
- Server-side pagination for `/shop` and `/collections/[slug]`
- Persisted cart state
- Stripe Checkout test-mode integration
- Signed Stripe webhook handling
- Idempotent order creation
- Transactional stock deduction
- Refunded order path for post-payment stock failure
- User order history
- Admin product and order management
- Technical SEO foundation with metadata, canonical URLs, Open Graph, Twitter cards, robots.txt, sitemap.xml and Product JSON-LD
- WebP product image optimization
- Vercel deployment with Neon Postgres
- Self-hosted VPS deployment with Nginx, HTTPS and PM2

## High Priority Future Work

- Add focused tests for checkout API behavior
- Add focused tests for Stripe webhook idempotency and stock deduction
- Store order item snapshots for product name and image at purchase time
- Persist Stripe `paymentIntentId` and `refundId`
- Add refund reason and refunded timestamp fields
- Replace remaining browser `alert()` calls with a toast system
- Limit cart quantity controls by available stock
- Disable add-to-cart for out-of-stock products

## Medium Priority Future Work

- Add related products on product detail pages
- Improve admin product image handling with object storage, such as Cloudflare R2, S3 or Vercel Blob
- Tighten `next.config.ts` image remote patterns
- Move `authOptions` out of the route file into a shared auth module
- Improve checkout address fields for Australian e-commerce expectations
- Keep search, category filters and pagination URL state consistent if advanced filtering is added

## Lower Priority Future Work

- Add Google OAuth in the overseas deployment
- Add email notifications for order confirmation and refund states
- Extract payment and order logic into a service layer before a future ASP.NET Core backend rewrite
- Add basic observability for production errors and webhook failures
- Add a small smoke-test script for deployed checkout-critical pages
