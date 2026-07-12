# Luna & Quartz

一个作品集级别的 Next.js 全栈电商 demo。项目定位为澳洲语境下的精品水晶独立站，包含英文 storefront、商品分类浏览、分页、持久化购物车、Stripe test checkout、webhook 订单状态更新、库存扣减、自动退款路径和后台商品/订单管理。

> 本项目是 portfolio demo，不处理真实付款、发货或客服。

## 项目亮点

- **Next.js App Router 全栈实现**：Server Components、Client Components、Route Handlers、metadata routes。
- **电商信息架构**：Landing page、shop、collections、product detail、FAQ、shipping、contact、crystal guide。
- **支付可靠性**：Stripe Checkout test mode、webhook 签名验证、幂等订单创建、原子库存扣减、库存不足自动退款。
- **后台管理**：商品新增/编辑/上下架、图片上传、订单状态流转。
- **SEO 基础设施**：动态 metadata、canonical URL、Open Graph、Twitter card、robots.txt、sitemap.xml、Product JSON-LD。
- **移动端体验**：hamburger drawer、搜索模式切换、移动端购物车浮层和页面溢出检查。

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
- Stripe webhook 使用签名验证
- webhook transaction 内做幂等检查和库存扣减
- 库存不足时创建 test-mode refund，并记录 `REFUNDED` 订单

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
- 商品图片当前是 demo 素材，真实商业项目需要确认素材授权和一致性。

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
Built a portfolio-ready e-commerce storefront with Next.js, TypeScript, Prisma and Stripe, including landing pages, collection-based browsing, paginated product listing, persisted cart state, checkout flow, webhook-based order updates, inventory-safe payment handling, admin product management and SEO-ready product pages.
```

## 后续计划

- 为 checkout API 和 Stripe webhook 增加关键测试
- 将 `OrderItem` 保存下单时的商品名和图片快照
- 保存 Stripe `paymentIntentId` / `refundId`
- 商品详情页增加 related products
- 将 SQLite 迁移到 PostgreSQL
- 未来用 C# / ASP.NET Core Web API 重写后端
