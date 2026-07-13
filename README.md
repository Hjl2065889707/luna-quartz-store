# Luna & Quartz

一个作品集级别的 Next.js 全栈电商 demo。项目定位为澳洲语境下的精品水晶独立站，包含英文 storefront、商品分类浏览、分页、持久化购物车、Stripe test checkout、webhook 订单状态更新、库存扣减、自动退款路径、后台商品/订单管理、SEO 基础设施和腾讯云部署。

> 本项目是 portfolio demo，不处理真实付款、发货或客服。

## Live Demo

```txt
https://shop.huangjunlong.cloud
```

部署方式：

- Tencent Cloud CVM
- Ubuntu + Nginx reverse proxy
- HTTPS certificate for `shop.huangjunlong.cloud`
- PM2 process management
- SQLite demo database
- Stripe test mode + public webhook endpoint

本项目的 admin 账号用于本地和受控演示。公开展示时不建议长期暴露可写后台账号。
Admin seed 凭据通过环境变量配置，不在仓库中保存固定密码。

## 项目亮点

- **Next.js App Router 全栈实现**：Server Components、Client Components、Route Handlers、metadata routes。
- **电商信息架构**：Landing page、shop、collections、product detail、FAQ、shipping、contact、crystal guide。
- **支付可靠性**：Stripe Checkout test mode、webhook 签名验证、幂等订单创建、原子库存扣减、库存不足自动退款。
- **后台管理**：商品新增/编辑/上下架、图片上传、订单状态流转。
- **SEO 基础设施**：动态 metadata、canonical URL、Open Graph、Twitter card、robots.txt、sitemap.xml、Product JSON-LD。
- **移动端体验**：hamburger drawer、搜索模式切换、移动端购物车浮层和页面溢出检查。
- **部署与性能收尾**：Nginx + HTTPS + PM2 部署，商品图从大体积 PNG 优化为 WebP。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- SQLite 本地开发数据库
- NextAuth / Auth.js credentials login
- Stripe Checkout + webhook
- React Hook Form + Zod
- Tailwind CSS
- SWR
- Nginx + PM2 + Tencent Cloud CVM

## 主要功能

### Storefront

- 首页 editorial landing page
- `/shop` 全部商品分页
- `/collections/[slug]` 分类商品分页
- `/product/[id]` 商品详情页
- 商品搜索，下拉结果点击进入详情页
- 持久化购物车
- Checkout 和 success / processing / refunded 状态页

### Admin

- `/admin` dashboard
- 商品创建、编辑、上下架
- 图片上传
- 订单列表
- 订单状态更新：`PAID -> SHIPPED -> DELIVERED`

### Payment Flow

- 前端提交购物车快照
- 后端使用 Zod 校验请求体
- 后端重新查询数据库校验商品、价格、名称、库存和上架状态
- Stripe Checkout session 使用后端确认过的数据
- Stripe redirect URL 使用 `NEXT_PUBLIC_SITE_URL`，避免反向代理环境下误跳 localhost
- Stripe webhook 使用签名验证
- webhook transaction 内做幂等检查和库存扣减
- 库存不足时创建 test-mode refund，并记录 `REFUNDED` 订单

### Deployment / Ops

- 子域名 `shop.huangjunlong.cloud`
- Nginx 反向代理到 Next.js production server
- PM2 后台运行和开机恢复
- HTTPS 配置和 SEO URL 校验
- Stripe webhook delivery 验收
- 商品图片 WebP 优化

## SEO 实现

项目已经实现：

- `NEXT_PUBLIC_SITE_URL` 驱动的站点 URL
- root layout `metadataBase`
- title template
- 页面级 metadata helper
- canonical URL
- Open Graph metadata
- Twitter card
- `/robots.txt`
- `/sitemap.xml`
- 商品页 Product JSON-LD
- 商品图片和缩略图 alt 文案

相关文件：

- `lib/site.ts`
- `lib/seo.ts`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/(shop)/product/[id]/page.tsx`

## 最终验收状态

封版前已经确认：

- `pnpm lint` 通过
- `pnpm exec tsc --noEmit --pretty false` 通过
- `pnpm build` 通过
- `/admin`、`/admin/orders`、`/admin/products` 为动态渲染，后台数据不会停留在 build 时快照
- HTTPS、robots.txt、sitemap.xml 可访问
- Stripe test checkout 成功跳回线上 success page
- Stripe webhook 可以创建订单，用户订单和后台订单均可查看
- 商品图片已压缩为 1000px WebP，总体积约从 55MB 降到 2.2MB

## 本地运行

安装依赖：

```bash
pnpm install
```

准备数据库：

```bash
pnpm prisma generate
pnpm prisma db push
pnpm seed
```

启动开发服务器：

```bash
pnpm dev
```

打开：

```txt
http://localhost:3000
```

## 常用命令

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
pnpm seed
pnpm update-product-images
pnpm update-admin-user
```

## 环境变量

本地创建 `.env`，根据实际情况填写：

```env
DATABASE_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-local-secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

SEED_ADMIN_EMAIL="replace-with-demo-admin-email"
SEED_ADMIN_PASSWORD="replace-with-strong-demo-admin-password"
```

部署时必须把 `NEXT_PUBLIC_SITE_URL` 改为真实 HTTPS 域名，例如：

```env
NEXT_PUBLIC_SITE_URL="https://shop.example.com"
NEXTAUTH_URL="https://shop.example.com"
NEXT_PUBLIC_API_BASE_URL="https://shop.example.com"
```

## 部署注意事项

- 如果部署到中国大陆服务器，公开网站通常需要确认备案和域名规则。
- Stripe API 和 webhook 需要服务器能稳定访问 Stripe。
- Google OAuth / Apple OAuth 暂未作为当前版本重点。
- 当前数据库是 SQLite，适合本地学习和 demo；正式部署建议迁移到 PostgreSQL。
- Prisma runtime 通过 `DATABASE_URL` 读取数据库路径；本地通常是 `file:./prisma/dev.db`，服务器 demo 通常是 `file:./prod.db`。
- 商品图已压缩为 WebP；真实商业项目仍需要确认素材授权和一致性。
- 线上更新商品图片路径时使用 `pnpm update-product-images`，不要为了改图片直接跑会清空订单的 `pnpm seed`。
- 线上更新 admin 账号密码时使用 `pnpm update-admin-user`，不要为了改密码直接跑会清空订单的 `pnpm seed`。该脚本会把其他 ADMIN 账号降级为 USER，避免旧演示账号继续拥有后台权限。
- 本地上传图片保存在 `public/uploads`，适合单机 demo；正式项目建议迁移到对象存储和 CDN。
- 商品上传 API 会校验登录角色、文件大小、MIME type 和基础图片签名，并由服务端生成文件扩展名。
- 公开 demo 不建议长期暴露可写 admin 账号；演示时可以临时创建或私下提供。

部署文档：

- [腾讯云部署 Checklist](docs/tencent-cloud-deployment-checklist.md)
- [部署连通性预检](docs/deployment-connectivity-check.md)
- [Stripe 支付、Webhook、库存和退款设计说明](docs/stripe-payment-webhook-design.md)
- [最终 Review 和作品集收尾](docs/final-review-and-portfolio-handoff.md)

## 验收清单

上线或展示前建议确认：

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
```

并手动检查：

- `/robots.txt`
- `/sitemap.xml`
- 商品页 metadata 和 Product JSON-LD
- Stripe test checkout
- webhook 成功路径
- 库存不足退款路径
- 移动端导航、搜索、购物车和 checkout success 页面

## Portfolio Summary

```txt
Built and deployed a portfolio-ready e-commerce storefront with Next.js, TypeScript, Prisma and Stripe, including landing pages, collection-based browsing, paginated product listing, persisted cart state, authenticated checkout, webhook-based order processing, atomic stock updates, refund handling, admin product/order management, technical SEO, WebP image optimization, and self-hosted deployment on Tencent Cloud with Nginx, HTTPS and PM2.
```

## 后续计划

- 为 checkout API 和 Stripe webhook 增加关键测试
- 将 `OrderItem` 保存下单时的商品名和图片快照
- 保存 Stripe `paymentIntentId` / `refundId`
- 商品详情页增加 related products
- 将 SQLite 迁移到 PostgreSQL
- 未来用 C# / ASP.NET Core Web API 重写后端
