# Luna & Quartz 简历与作品集说明

这份文档用于把 Luna & Quartz 项目整理成简历、作品集和面试表达。重点不是证明“做了一个购物网站”，而是证明你能把一个全栈业务系统从开发做到上线，并理解支付、订单、库存、后台、SEO 和部署这些真实项目会遇到的问题。

## 项目定位

中文理解：

```txt
Luna & Quartz 是一个作品集级别的 Next.js 全栈电商 demo，模拟精品水晶独立站。项目覆盖商品浏览、分类分页、购物车、Stripe test checkout、webhook 订单创建、库存扣减、用户订单、后台管理、SEO 和 VPS 部署。
```

英文简历定位：

```txt
A full-stack e-commerce demo built with Next.js, TypeScript, Prisma and Stripe, simulating a production-style crystal storefront with checkout, order management, admin workflows, SEO and VPS deployment.
```

## 简历项目标题

推荐写法：

```txt
Luna & Quartz - Full-stack E-commerce Demo
Next.js, React, TypeScript, Prisma, SQLite, NextAuth, Stripe, Tailwind CSS, Nginx, PM2
```

如果简历空间很紧，可以压缩为：

```txt
Luna & Quartz - Full-stack E-commerce Demo | Next.js, TypeScript, Prisma, Stripe, Nginx, PM2
```

## 简历 Bullet Points

推荐完整版：

```txt
- Built and deployed a full-stack e-commerce demo covering product catalog, category browsing, pagination, cart, checkout, user orders and admin management.
- Integrated Stripe Checkout with webhook-based order creation, idempotency handling, stock validation and transactional inventory updates.
- Developed protected admin workflows for product and order management, including role-based access control and secure image upload validation.
- Implemented SEO metadata, canonical URLs, sitemap.xml, robots.txt, Open Graph metadata and Product JSON-LD for a production-style storefront.
- Deployed the application to a Linux VPS using Nginx reverse proxy, PM2 process management, HTTPS and environment-based configuration.
```

更适合一页简历的精简版：

```txt
- Built and deployed a full-stack e-commerce demo with Next.js, TypeScript, Prisma and Stripe, including product catalog, cart, checkout, user orders and admin workflows.
- Implemented Stripe Checkout and webhook-based order creation with idempotency handling, stock validation and transactional inventory updates.
- Configured SEO metadata, sitemap.xml, robots.txt and Linux VPS deployment using Nginx, PM2, HTTPS and environment variables.
```

如果你投的是更偏后端 / 全栈岗位，可以突出这一版：

```txt
- Designed a payment and order workflow using Stripe Checkout, signed webhooks, transactional stock deduction and idempotent order creation.
- Validated checkout requests on the server by reloading product data from the database, preventing client-side price or inventory manipulation.
- Deployed and operated the app on a Linux VPS with Nginx, PM2, HTTPS, environment variables and production build validation.
```

如果你投的是更偏前端 / React 岗位，可以突出这一版：

```txt
- Built responsive storefront pages with Next.js App Router, Server Components, Client Components, category browsing, pagination and product detail pages.
- Implemented a polished mobile navigation and search experience, including hamburger drawer, search overlay and clickable product results.
- Added SEO-friendly pages with metadata, canonical URLs, sitemap, robots.txt and Product JSON-LD.
```

## 作品集页面说明

作品集里可以写得比简历详细一点，但不要写成技术流水账。推荐结构是：项目一句话、技术栈、核心功能、技术亮点、学习收获。

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
- How to structure a realistic full-stack flow in Next.js App Router.
- How to decide Server Component and Client Component boundaries.
- How Stripe Checkout, redirects and webhooks work together.
- Why backend validation, idempotency and transactions are important in payment systems.
- How to deploy a Next.js app to a Linux VPS with Nginx, PM2 and HTTPS.
- How to prepare a demo project for portfolio presentation with documentation and SEO.
```

## 面试 30 秒介绍

英文版本：

```txt
Luna & Quartz is a full-stack e-commerce demo I built with Next.js and TypeScript. It includes a crystal storefront, category browsing, pagination, cart, Stripe Checkout, webhook-based order creation, stock validation, user order history and admin management. I also deployed it to a Linux VPS with Nginx, PM2 and HTTPS. The main focus was building a realistic business workflow rather than only a static UI.
```

中文理解：

```txt
这是一个 Next.js 全栈电商 demo，不只是页面展示。它覆盖了商品、分页、购物车、Stripe 支付、webhook 创建订单、库存扣减、用户订单、后台管理、SEO 和 VPS 部署。我的重点是学习真实业务系统里的完整链路，而不是只做一个静态页面。
```

## 面试可能被问到的问题

你可以重点准备这些问题：

```txt
1. 为什么 Stripe webhook 需要幂等处理？
2. 为什么 checkout 时不能完全相信前端传来的价格？
3. 为什么库存扣减要放在 transaction 里？
4. 为什么 admin 页面要强制 dynamic rendering？
5. Next.js Server Component 和 Client Component 在这个项目里如何划分？
6. 为什么 SQLite 适合 demo，但真实生产项目更适合 PostgreSQL？
7. Nginx、PM2、HTTPS 在部署里分别解决什么问题？
8. SEO metadata、sitemap、robots.txt、canonical URL 分别有什么作用？
```

## 不建议重点强调的内容

这些不是不能提，而是不应该作为简历主卖点：

```txt
- 使用了 Context / useReducer
- 使用了 Tailwind CSS
- 做了水晶 mock data
- 使用了 SQLite
- 参考了某个网站风格
```

它们更适合作为技术细节，在面试追问时解释。简历主卖点应该放在：

```txt
- 支付链路
- webhook
- 订单状态
- 库存一致性
- 后台管理
- SEO
- 部署
- 全栈业务闭环
```

## 简历表达原则

写简历时尽量遵守这几个原则：

```txt
1. 不要只写技术名词，要写你用技术完成了什么业务结果。
2. 不要把 demo 写得像真实商业项目，保持诚实，明确是 portfolio demo。
3. 不要堆砌过多库名，优先突出支付、订单、库存、后台和部署。
4. 不要写“熟练掌握”，用项目事实证明能力。
5. 针对不同岗位调整 bullet 的顺序。
```

## 最终推荐版本

如果只能选一个版本放进简历，我建议使用这一版：

```txt
Luna & Quartz - Full-stack E-commerce Demo
Next.js, React, TypeScript, Prisma, SQLite, NextAuth, Stripe, Tailwind CSS, Nginx, PM2

- Built and deployed a full-stack e-commerce demo covering product catalog, category browsing, pagination, cart, checkout, user orders and admin management.
- Integrated Stripe Checkout with webhook-based order creation, idempotency handling, stock validation and transactional inventory updates.
- Implemented SEO metadata, sitemap.xml, robots.txt and responsive storefront pages for a production-style portfolio demo.
- Deployed the application to a Linux VPS using Nginx reverse proxy, PM2 process management, HTTPS and environment-based configuration.
```

