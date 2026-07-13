# Luna & Quartz Resume and Portfolio Notes

This document turns Luna & Quartz into reusable resume, portfolio and interview material. The goal is not to describe it as “a shopping website”, but to present it as a full-stack business workflow covering storefront, checkout, orders, inventory, admin, SEO and deployment.

## Project Positioning

Recommended project summary:

```txt
Luna & Quartz is a full-stack e-commerce demo built with Next.js, TypeScript, Prisma and Stripe. It simulates a boutique crystal storefront with product browsing, category pages, pagination, cart, Stripe test checkout, webhook-based order creation, admin workflows, SEO and VPS deployment.
```

Short version:

```txt
A production-style full-stack e-commerce demo built with Next.js, TypeScript, Prisma and Stripe.
```

## Resume Project Title

Recommended version:

```txt
Luna & Quartz - Full-stack E-commerce Demo
Next.js, React, TypeScript, Prisma, SQLite, NextAuth, Stripe, Tailwind CSS, Nginx, PM2
```

Compact version:

```txt
Luna & Quartz - Full-stack E-commerce Demo | Next.js, TypeScript, Prisma, Stripe, Nginx, PM2
```

## Resume Bullet Points

Recommended full version:

```txt
- Built and deployed a full-stack e-commerce demo covering product catalog, category browsing, pagination, cart, checkout, user orders and admin management.
- Integrated Stripe Checkout with webhook-based order creation, idempotency handling, stock validation and transactional inventory updates.
- Developed protected admin workflows for product and order management, including role-based access control and secure image upload validation.
- Implemented SEO metadata, canonical URLs, sitemap.xml, robots.txt, Open Graph metadata and Product JSON-LD for a production-style storefront.
- Deployed the application to a Linux VPS using Nginx reverse proxy, PM2 process management, HTTPS and environment-based configuration.
```

Compact resume version:

```txt
- Built and deployed a full-stack e-commerce demo with Next.js, TypeScript, Prisma and Stripe, including product catalog, cart, checkout, user orders and admin workflows.
- Implemented Stripe Checkout and webhook-based order creation with idempotency handling, stock validation and transactional inventory updates.
- Configured SEO metadata, sitemap.xml, robots.txt and Linux VPS deployment using Nginx, PM2, HTTPS and environment variables.
```

Backend / full-stack focused version:

```txt
- Designed a payment and order workflow using Stripe Checkout, signed webhooks, transactional stock deduction and idempotent order creation.
- Validated checkout requests on the server by reloading product data from the database, preventing client-side price or inventory manipulation.
- Deployed and operated the app on a Linux VPS with Nginx, PM2, HTTPS, environment variables and production build validation.
```

Frontend / React focused version:

```txt
- Built responsive storefront pages with Next.js App Router, Server Components, Client Components, category browsing, pagination and product detail pages.
- Implemented a polished mobile navigation and search experience, including hamburger drawer, search overlay and clickable product results.
- Added SEO-friendly pages with metadata, canonical URLs, sitemap, robots.txt and Product JSON-LD.
```

## Portfolio Case Study

Use this structure for a portfolio page or project section.

### Project Summary

```txt
Luna & Quartz is a full-stack e-commerce demo built with Next.js and TypeScript. It simulates a boutique crystal store with product browsing, category pages, pagination, persisted cart, Stripe test checkout, webhook-based order creation, user order history, admin product management and production deployment.
```

### Tech Stack

```txt
Next.js, React, TypeScript, Prisma, SQLite, NextAuth, Stripe, Tailwind CSS, Nginx, PM2
```

### Key Features

```txt
- Landing page, shop page, collection pages and product detail pages
- Category filtering and paginated product browsing
- Persisted shopping cart
- Stripe Checkout in test mode
- Signed Stripe webhook for order creation
- Idempotency handling and transactional stock deduction
- User order history
- Protected admin product and order management
- SEO metadata, sitemap.xml, robots.txt and Product JSON-LD
- VPS deployment with Nginx, PM2 and HTTPS
```

### Technical Highlights

```txt
- Server-side checkout validation: product IDs, names, prices, quantities, stock and active status are validated against database records before creating a Stripe Checkout session.
- Webhook reliability: Stripe checkout.session.completed events are handled with signature verification, idempotency checks and transaction-based stock updates.
- Production deployment: the app is deployed behind Nginx with HTTPS, PM2 process management and environment-based configuration.
- SEO foundation: pages include metadata, canonical URLs, sitemap, robots.txt, Open Graph data and product structured data.
```

### What I Learned

```txt
- How to structure a realistic full-stack workflow in Next.js App Router.
- How to decide Server Component and Client Component boundaries.
- How Stripe Checkout, redirects and webhooks work together.
- Why backend validation, idempotency and transactions matter in payment systems.
- How to deploy a Next.js app to a Linux VPS with Nginx, PM2 and HTTPS.
- How to prepare a demo project for portfolio presentation with documentation and SEO.
```

## 30-second Interview Pitch

```txt
Luna & Quartz is a full-stack e-commerce demo I built with Next.js and TypeScript. It includes a crystal storefront, category browsing, pagination, cart, Stripe Checkout, webhook-based order creation, stock validation, user order history and admin management. I also deployed it to a Linux VPS with Nginx, PM2 and HTTPS. The main focus was building a realistic business workflow rather than only a static UI.
```

## Interview Questions To Prepare

```txt
1. Why does a Stripe webhook handler need idempotency?
2. Why should checkout prices be validated on the server?
3. Why should stock deduction happen inside a database transaction?
4. Why do admin pages need dynamic rendering in this project?
5. How did you decide Server Component and Client Component boundaries?
6. Why is SQLite acceptable for a demo, and why would PostgreSQL be better for production?
7. What problems do Nginx, PM2 and HTTPS solve in deployment?
8. What are SEO metadata, sitemap.xml, robots.txt and canonical URLs used for?
```

## Details Not To Overemphasize

These can be mentioned if asked, but they should not be the main resume selling points:

```txt
- Context / useReducer
- Tailwind CSS
- Crystal mock data
- SQLite
- Visual inspiration from another storefront
```

The stronger selling points are:

```txt
- Payment flow
- Webhooks
- Order state
- Inventory consistency
- Admin workflows
- SEO
- Deployment
- End-to-end full-stack business flow
```

## Resume Writing Principles

```txt
1. Do not only list technologies. Explain what business workflow you built with them.
2. Be honest that this is a portfolio demo, not a real production business.
3. Avoid overloading the project description with library names.
4. Prefer concrete project facts over vague claims such as “proficient in”.
5. Reorder bullet points depending on whether the role is frontend-heavy, backend-heavy or full-stack.
```

## Final Recommended Resume Version

```txt
Luna & Quartz - Full-stack E-commerce Demo
Next.js, React, TypeScript, Prisma, SQLite, NextAuth, Stripe, Tailwind CSS, Nginx, PM2

- Built and deployed a full-stack e-commerce demo covering product catalog, category browsing, pagination, cart, checkout, user orders and admin management.
- Integrated Stripe Checkout with webhook-based order creation, idempotency handling, stock validation and transactional inventory updates.
- Implemented SEO metadata, sitemap.xml, robots.txt and responsive storefront pages for a production-style portfolio demo.
- Deployed the application to a Linux VPS using Nginx reverse proxy, PM2 process management, HTTPS and environment-based configuration.
```

