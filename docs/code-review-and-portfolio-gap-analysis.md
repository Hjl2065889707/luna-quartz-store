# Code Review 和作品集差距分析

本文档记录 Phase 1 的审查结果。目标不是挑刺，而是把这个项目从“学习 demo”逐步收尾成一个可以部署、可以写进简历、也可以作为最佳实践参考的 Next.js 全栈项目。

后续项目定位：

- 英文水晶独立站 demo
- Next.js full-stack 第一版
- Stripe test mode
- 邮箱密码登录为主
- 腾讯云服务器部署练习
- 后续预留迁移到 C# / ASP.NET Core Web API 的空间

## 当前进度更新：2026-07-13

本文档最初记录的是 Phase 1 的 code review 结果，其中很多问题已经在后续阶段修复。现在项目状态如下：

已完成的地基修复：

- `pnpm lint` 已通过。
- `pnpm exec tsc --noEmit --pretty false` 已通过。
- `pnpm build` 已通过。
- 已移除 `next/font/google`，改用系统字体，避免腾讯云或其他网络受限环境构建失败。
- 已删除废弃的 `data/product.ts`。
- 已移除客户端请求里的硬编码 `localhost:3000`，改为环境变量驱动的 API base URL。
- Stripe checkout redirect URL 已改为使用 `NEXT_PUBLIC_SITE_URL`，避免反向代理部署后误跳 localhost。
- 已将 Next 16 弃用的 `middleware.ts` 迁移为 `proxy.ts`。
- 已在 `next.config.ts` 配置 `turbopack.root`，消除 workspace root 推断警告。

已完成的支付和订单可靠性改造：

- Checkout API 使用 Zod 进行运行时校验。
- 后端会重新校验商品是否存在、是否上架、库存、价格和名称。
- Stripe webhook 使用签名验证。
- webhook 创建订单时使用 `stripeSessionId` 做幂等处理。
- webhook 中使用数据库原子更新扣库存，避免并发下库存扣成负数。
- 库存不足时自动发起 Stripe refund，并创建 `REFUNDED` 订单。
- success page 会根据数据库订单状态显示 `PAID`、`REFUNDED` 或 processing。
- 用户订单页会显示退款说明。
- 订单状态、状态样式和状态流转规则已集中到 `lib/orderStatus.ts`。
- 订单状态更新 API 已使用 Zod 校验请求体。
- 腾讯云 CVM + Nginx + HTTPS + PM2 部署已跑通。
- Stripe test checkout + webhook 入站验收已跑通。
- Admin 运营页面已显式动态渲染，避免生产环境复用 build 时数据。
- 商品图片已从大体积 PNG 优化为 WebP。

已完成的展示一致性修复：

- 全站金额显示统一为 `AUD`，使用 `formatCurrency()`。
- 用户端和 admin 端订单状态展示已统一。

当前版本已经可以暂时封版。后续如果继续推进，重点不再是补页面，而是：

```text
Batch 6：关键 API / webhook 测试
Batch 7：OrderItem 商品快照
Batch 8：PostgreSQL 或 C# / ASP.NET Core 后端迁移
```

因此，下方的 P0/P1 审查内容应理解为“历史发现和最佳实践说明”。如果某一项已经修复，应以本节和 `TODO.md` 的最新状态为准。

## 总体结论

这个项目已经覆盖了很多全栈关键概念：

- App Router
- Server Component 和 Client Component
- Prisma ORM
- 用户注册登录
- 角色权限
- 商品 CRUD
- 图片上传
- 购物车
- Stripe checkout
- Stripe webhook
- 订单历史
- Admin dashboard

最初审查时，它还不是一个适合直接作为“最佳实践参考”的项目，因为：

- `lint` 不通过。
- TypeScript 类型检查不通过。
- 生产构建目前会因为 Google Fonts 请求失败而失败。
- 结账接口信任了前端传来的价格。
- 部署路径里有硬编码 `localhost`。
- 数据库文件和上传文件被 Git 跟踪。
- 页面和文案仍然像练习项目，缺少真实独立站的产品感。

建议后续先修地基，再做视觉和内容升级。

推荐改造顺序：

```text
Batch 1：修硬伤和最佳实践地基（已完成）
Batch 2：水晶独立站英文产品化（已完成）
Batch 3：商品列表分页、筛选、排序（已完成分页）
Batch 4：技术 SEO 和 README（已完成）
Batch 5：腾讯云部署（已完成）
```

---

## P0：必须先修的问题

P0 表示上线前必须处理，或者作为最佳实践参考项目时不能留着的问题。

### 1. `lint`、`typecheck`、`build` 没有通过

相关文件：

- `app/(checkout)/checkout/page.tsx`
- `app/api/checkout/route.ts`
- `context/CartContext.tsx`
- `components/admin/ProductDialog.tsx`
- `data/product.ts`

当时结果（已修复）：

```text
pnpm lint
4 errors, 11 warnings

pnpm exec tsc --noEmit
data/product.ts 中 id 类型不匹配

pnpm build
因为 next/font/google 访问 Google Fonts 失败而构建失败
```

为什么这是问题：

一个作品集项目如果连基础检查都不通过，会给面试官一个信号：这个项目还停留在练习阶段，没有被收尾到生产质量。

最佳实践：

每次准备展示或部署前，至少保证这三个命令通过：

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

怎么解决：

1. 删除未使用 import 和变量。
2. 去掉 `any`，给 checkout request body 定义类型。
3. 删除或修复已经废弃的 `data/product.ts`。
4. 修复 React Compiler / ESLint 报错。
5. 把 Google Fonts 改成本地字体或系统字体。

你能学到什么：

- 工程质量收尾
- ESLint 和 TypeScript 在真实项目里的作用
- 为什么“能跑”和“可交付”不是一回事

---

### 2. Checkout 接口信任了前端传来的价格

相关文件：

- `app/api/checkout/route.ts`
- `api-client/orderApi.ts`
- `context/CartContext.tsx`

当前逻辑：

前端把购物车里的 `name`、`price`、`quantity` 发给后端：

```ts
{
  productId,
  name,
  quantity,
  price
}
```

后端直接用这些字段创建 Stripe line items。

为什么这是问题：

浏览器里的数据都不可信。用户可以改 localStorage，也可以直接伪造请求，把商品价格改成 `0.01`。如果后端直接相信前端价格，就会出现严重支付漏洞。

最佳实践：

前端只能提交：

```ts
{
  productId,
  quantity
}
```

后端必须重新查询数据库：

```ts
const products = await prisma.product.findMany({
  where: { id: { in: productIds }, isActive: true },
})
```

然后后端用数据库里的：

- `product.name`
- `product.price`
- `product.stock`

来创建 Stripe checkout session。

怎么解决：

1. 定义 `checkoutRequestSchema`。
2. 请求体只允许 `productId` 和 `quantity`。
3. 后端批量查商品。
4. 校验商品是否存在、是否上架、库存是否足够。
5. 用数据库价格创建 Stripe line items。
6. 写入 metadata 时，也只写后端确认过的数据。

你能学到什么：

- 前后端信任边界
- 支付接口安全
- Zod 运行时校验
- 数据库作为 source of truth

这是非常值得你亲手学的一块。

---

### 3. `next/font/google` 会影响腾讯云构建

相关文件：

- `app/layout.tsx`

当前逻辑：

项目使用：

```ts
import { Geist, Geist_Mono } from 'next/font/google'
```

构建时 Next.js 需要访问 Google Fonts。当前 `pnpm build` 已经因为无法访问 Google Fonts 失败。

为什么这是问题：

腾讯云上海服务器也可能无法稳定访问 Google Fonts。即使你的业务代码没有问题，部署时也会卡在构建阶段。

最佳实践：

如果部署环境访问 Google 不稳定，不要在构建阶段依赖 Google Fonts。可以选择：

1. 使用系统字体。
2. 下载字体文件，使用 `next/font/local`。
3. 选择不需要外部网络请求的字体方案。

怎么解决：

短期最简单：

```ts
// 去掉 next/font/google
// 在 globals.css 里使用 system font stack
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

更完整：

```ts
import localFont from 'next/font/local'
```

然后把字体文件放入项目，例如：

```text
public/fonts/...
```

你能学到什么：

- 构建期依赖和运行期依赖的区别
- 为什么部署环境会影响技术选择
- 中国大陆服务器部署时的常见坑

---

## P1：强烈建议修的问题

P1 表示不一定马上导致项目跑不起来，但会明显影响安全性、部署质量或作品集说服力。

### 4. Server Component 调自己的 API，并且硬编码 localhost

相关文件：

- `api-client/productApi.ts`
- `app/(shop)/page.tsx`
- `app/(shop)/product/[id]/page.tsx`

当前逻辑：

```ts
fetch('http://localhost:3000/api/products')
fetch('http://localhost:3000/api/products/${id}')
```

为什么这是问题：

部署到腾讯云后，应用不一定运行在 `localhost:3000`。即使端口相同，从 Server Component 调自己的 HTTP API 也通常没有必要。

最佳实践：

在 Next.js full-stack 项目里：

- Server Component 直接查 server-side data layer。
- Client Component 才通过 `/api/...` 调接口。

例如：

```ts
// Server Component
const products = await getAllProducts()
```

而不是：

```ts
await fetch('http://localhost:3000/api/products')
```

如果未来要迁移到 C# / .NET 后端，可以等到真正拆后端时，再引入：

```text
NEXT_PUBLIC_API_BASE_URL
SERVER_API_BASE_URL
```

怎么解决：

1. 把 server-side 查询放到 `api-client/productApi.server.ts` 或更清晰的 `lib/data/products.ts`。
2. 首页和商品详情页直接调用 server data function。
3. `api-client/productApi.ts` 保留给 Client Component 使用。

你能学到什么：

- Server Component 的正确数据获取方式
- API route 和 server data layer 的边界
- 为未来 .NET 后端迁移保留接口边界

---

### 5. Stripe webhook 缺少幂等处理

相关文件：

- `app/api/webhooks/stripe/route.ts`

当前逻辑：

收到 `checkout.session.completed` 后直接创建订单。

为什么这是问题：

Stripe webhook 可能重复发送同一个事件。如果同一个 session 被处理两次，可能会：

- 重复扣库存
- 重复创建订单
- 因为唯一约束报错

最佳实践：

webhook 必须是幂等的。同一个 Stripe session 重复到达时，结果应该和处理一次一样。

怎么解决：

在创建订单前先查：

```ts
const existingOrder = await prisma.order.findUnique({
  where: { stripeSessionId: session.id },
})

if (existingOrder) {
  return NextResponse.json({ received: true })
}
```

你能学到什么：

- webhook 幂等性
- 第三方支付回调的可靠性设计
- 为什么外部系统事件不能假设只来一次

---

### 6. Webhook 扣库存没有防止负库存

相关文件：

- `app/api/webhooks/stripe/route.ts`
- `TODO.md`

当前逻辑：

```ts
stock: { decrement: item.quantity }
```

为什么这是问题：

如果两个用户同时购买最后一件商品，两个 checkout 都可能通过前置库存检查。等 webhook 回来时，如果不再次校验库存，库存可能被扣成负数。

最佳实践：

库存扣减必须在事务里做最终校验。

一种做法：

```ts
const updated = await tx.product.updateMany({
  where: {
    id: item.productId,
    stock: { gte: item.quantity },
  },
  data: {
    stock: { decrement: item.quantity },
  },
})

if (updated.count !== 1) {
  throw new Error('Insufficient stock')
}
```

真实业务里，如果付款成功后库存不足，还需要：

- 创建异常记录
- 通知管理员
- 自动退款或人工处理

你能学到什么：

- 事务
- 并发场景
- 库存一致性
- 支付成功后业务失败怎么处理

---

### 7. 订单缺少商品快照

相关文件：

- `prisma/schema.prisma`
- `app/(shop)/account/orders/page.tsx`

当前设计：

`OrderItem` 只保存：

- `productId`
- `quantity`
- `price`

为什么这是问题：

如果商品后来改名、换图、下架，历史订单展示会变化。真实订单应该记录“下单当时”的商品信息。

最佳实践：

`OrderItem` 应该保存快照：

```prisma
model OrderItem {
  id           String @id @default(cuid())
  orderId      String
  productId    String
  productName  String
  productImage String
  quantity     Int
  unitPrice    Float
}
```

怎么解决：

1. 修改 Prisma schema。
2. 创建 migration。
3. webhook 创建订单时写入 `productName`、`productImage`、`unitPrice`。
4. 订单历史页优先展示快照，而不是依赖当前 Product。

你能学到什么：

- 订单系统的数据建模
- 为什么历史数据需要快照
- 数据库 migration

---

### 8. 本地上传文件不适合所有部署方式

相关文件：

- `app/api/upload/route.ts`
- `public/uploads/`

当前逻辑：

上传文件保存到：

```text
public/uploads/
```

为什么这是问题：

在腾讯云单机部署，这个方案可以工作。但在 Vercel 这类 serverless 环境，不能把运行时写入的本地文件当作持久存储。

最佳实践：

根据部署方案选择存储：

```text
腾讯云服务器：本地磁盘可以作为学习版本
更通用方案：腾讯云 COS / S3 / R2 / Vercel Blob
```

怎么解决：

第一阶段可以保留本地上传，但 README 要写清楚：

```text
This demo stores uploaded images on local disk for the cloud VM deployment path.
For serverless deployment, object storage such as S3/R2/COS is recommended.
```

第二阶段可以抽象：

```ts
uploadProductImage(file)
```

以后从本地磁盘换成 COS/R2 时，业务代码不用大改。

你能学到什么：

- 文件存储和部署平台的关系
- 对象存储的价值
- 如何给未来迁移留接口

---

### 9. `prisma/dev.db`、上传文件和旧图片资源被 Git 跟踪

相关文件：

- `prisma/dev.db`
- `public/uploads/...`
- `public/products/*.png`

当前情况：

这些文件曾经在 Git 跟踪列表里。

为什么这是问题：

数据库文件和用户上传文件通常不应该进入仓库。它们是运行时数据，不是源代码。商品图片迁移到 WebP 后，旧的大体积 PNG 也不应该继续保留在公开仓库里。

最佳实践：

仓库应该保存：

- Prisma schema
- migrations
- seed 脚本
- 示例商品数据
- 文档

仓库不应该保存：

- 本地数据库文件
- 用户上传文件
- 已被 WebP 替代的旧 PNG 素材
- `.env`
- secret key

怎么解决：

1. 确认 `.gitignore` 包含：

```gitignore
.env*
prisma/dev.db
public/uploads/*
public/products/*.png
!public/uploads/.gitkeep
```

2. 如果这些文件已经被 Git 跟踪，需要从 Git index 移除，但不删除本地文件：

```bash
git rm --cached prisma/dev.db
git rm --cached public/uploads/<runtime-upload-file>
git rm public/products/*.png
```

注意：执行前确认当前 Git 状态，避免误删用户数据。`--cached` 只会停止 Git 跟踪，不会删除本地文件；旧 PNG 如果已经确认不再被代码引用，可以直接从本地和仓库删除。

你能学到什么：

- 源代码和运行时数据的边界
- `.gitignore` 的正确使用
- 部署环境如何通过 seed/migration 重建数据

---

### 10. Seed 脚本包含固定 admin 密码

相关文件：

- `prisma/seed.ts`

历史逻辑：

```ts
seed 脚本曾经包含固定 admin 邮箱和密码
```

为什么这是问题：

作品集 demo 可以有测试账号，但不要把它做得像生产账号。公开 README 里可以提供 demo credential，但生产部署要通过环境变量控制。

最佳实践：

当前实现已经改为读取环境变量：

```text
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

如果没有设置，`pnpm seed` 会直接失败，避免无意中把固定弱密码部署到公网环境。

公开 README 不保存 admin 密码。需要演示后台时，可以临时创建演示账号或私下提供凭据。

不要采用：

```text
Demo only hard-coded password
```

你能学到什么：

- seed 数据和生产数据的区别
- 环境变量管理
- demo 项目如何安全展示测试账号

---

## P2：代码质量和可维护性优化

### 11. API Route 缺少统一 Zod 校验

相关文件：

- `app/api/products/route.ts`
- `app/api/products/[id]/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/checkout/route.ts`

为什么这是问题：

TypeScript 只在编译时保护你，无法阻止用户发一个错误或恶意的 JSON 请求。

最佳实践：

所有会修改数据的接口都应该做运行时校验：

```ts
const parsed = productSchema.safeParse(await req.json())

if (!parsed.success) {
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
```

你能学到什么：

- 编译时类型和运行时校验的区别
- API 防御式编程
- 错误响应设计

---

### 12. `authOptions` 从 route 文件导出

相关文件：

- `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`
- 多个 API route

当前做法：

多个文件从 NextAuth route 文件导入：

```ts
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
```

为什么这是问题：

route 文件最好只负责导出 HTTP handler。把配置从 route 文件里反复导入，会让依赖边界不清晰，也可能在后续打包或迁移中变麻烦。

最佳实践：

把配置抽到：

```text
lib/auth.ts
```

然后 route 文件只做：

```ts
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

其他地方统一从 `lib/auth.ts` 导入。

你能学到什么：

- 框架入口和业务配置分离
- 模块边界
- 后续迁移到独立后端时如何保持清晰结构

---

### 13. Product 类型手写，和 Prisma model 可能漂移

相关文件：

- `types/product.ts`
- `prisma/schema.prisma`

当前逻辑：

手写：

```ts
export interface Product {
  id: string
  name: string
  price: number
  ...
}
```

为什么这是问题：

如果 Prisma schema 改了，手写类型可能忘记同步。

最佳实践：

对于数据库实体，可以优先使用 Prisma 生成类型：

```ts
import type { Product } from '@prisma/client'
```

如果前端需要不同形状，再单独定义 DTO：

```ts
type ProductCardDto = Pick<Product, 'id' | 'name' | 'price' | 'image'>
```

你能学到什么：

- ORM 类型复用
- Entity 和 DTO 的区别
- 如何减少类型重复

---

### 14. 图片 remotePatterns 太宽

相关文件：

- `next.config.ts`

当前逻辑：

```ts
hostname: '**'
```

为什么这是问题：

这等于允许任何远程图片域名。作为 demo 可以跑，但不是最好的安全和性能边界。

最佳实践：

只允许你实际使用的图片来源：

```ts
images.unsplash.com
images.pexels.com
your-cdn-domain.com
```

你能学到什么：

- Next/Image 的远程图片安全边界
- 生产配置不应过度放开

---

## P3：作品集产品化差距

P3 不一定是 bug，但会决定这个项目看起来像“课程练习”还是“真实产品”。

### 15. 品牌和内容还不是水晶独立站

当前情况：

- 品牌还是 `Antigravity Store`
- 商品是衣服、耳机、家具等混合品类
- 首页文案偏 demo
- 页面中英文混杂
- 价格符号混用 `¥` 和 `$`

目标方向：

改成英文水晶独立站，例如：

```text
Luna & Stone
Crystal Cove Studio
Aurora Crystals
```

商品分类可以是：

```text
Tumbled Stones
Crystal Towers
Bracelets
Suncatchers
Home Rituals
Gift Sets
```

首页可以包含：

- Shipping bar
- Hero
- Featured collections
- Best sellers
- Ritual / gifting section
- Testimonials
- FAQ
- Newsletter

你能学到什么：

- 产品定位
- 电商信息架构
- 英文 UI 文案
- 从 demo 到 portfolio project 的包装能力

---

### 16. 需要 24 个商品和分页

为什么值得做：

分页是非常常见的全栈能力。它同时涉及：

- URL search params
- 数据库 `skip/take`
- `count`
- 排序
- 筛选
- 空状态
- 前端分页 UI

建议接口形态：

```text
/products?page=1&pageSize=12&category=towers&sort=price-asc&q=amethyst
```

Prisma 查询：

```ts
const [items, total] = await Promise.all([
  prisma.product.findMany({
    where,
    skip,
    take,
    orderBy,
  }),
  prisma.product.count({ where }),
])
```

返回：

```ts
{
  items,
  page,
  pageSize,
  total,
  totalPages
}
```

你能学到什么：

- 分页的完整思路
- URL 状态管理
- 数据库查询设计
- 用户体验中的 loading / empty state

这块建议你亲手学，我可以边讲边带你写。

---

### 17. 技术 SEO 值得做

为什么值得现在学：

电商项目天然适合学技术 SEO。Next.js 也非常适合展示这块能力。

建议做：

- `metadata`
- 商品页 `generateMetadata`
- Open Graph
- `robots.txt`
- `sitemap.xml`
- Product JSON-LD
- 图片 alt
- 语义化 heading

你能学到什么：

- Next.js Metadata API
- 商品页 SEO
- 搜索引擎如何理解页面
- 作品集项目如何显得更完整

不建议现在深入：

- 关键词运营
- 外链建设
- 商业投放
- SEO 数据分析

这些优先级比技术 SEO 低。

---

## 腾讯云部署判断

你已经做了初步测试，结果记录在：

- `docs/deployment-connectivity-check.md`

当前判断：

- Stripe API：`HTTP 200 in 0.666203s`，这是好消息。
- Google OAuth：均无法访问，不适合作为腾讯云部署版本核心功能。
- Apple OAuth：可访问，但配置成本较高，暂缓。

建议：

这个版本继续以腾讯云为部署练习目标，但功能上保持：

```text
邮箱密码登录
Stripe test mode
Nginx + HTTPS + 子域名
本地磁盘上传或后续 COS/R2 抽象
```

Google OAuth 可以留作未来 Vercel 或海外部署版本的增强项。

---

## 推荐下一步

### Batch 1：修地基

建议优先修：

1. `lint` 通过。
2. `typecheck` 通过。
3. `build` 通过。
4. 移除 `localhost:3000` 硬编码。
5. Checkout 后端重新查数据库价格。
6. Webhook 加幂等。
7. Seed 和 Git hygiene。
8. README 加环境变量和 demo 说明。

### Batch 2：水晶独立站改造

包括：

1. 英文品牌。
2. 24 个水晶商品。
3. 商品图片。
4. 分类。
5. 商品描述和 usage notes。
6. AUD 价格。
7. 首页和详情页产品化。

### Batch 3：分页和筛选

这部分建议你重点学习：

1. page/pageSize。
2. category。
3. sort。
4. search。
5. totalPages。
6. URL search params。

### Batch 4：SEO 和部署文档

包括：

1. sitemap。
2. robots。
3. product JSON-LD。
4. Open Graph。
5. 腾讯云 Nginx 部署文档。
6. Stripe webhook 配置文档。

---

## 你应该重点亲手学的部分

建议你亲手写或至少深度参与：

- Checkout 安全改造
- Zod API 校验
- 分页
- 技术 SEO
- 腾讯云部署
- Stripe webhook

这些都是简历和面试里能讲出含金量的部分。

我可以直接帮你实现的部分：

- 英文文案整理
- 24 个商品 seed 数据
- UI polish
- README 初稿
- 删除无用代码
- 批量中英文替换
- 样式统一

这样能把你的学习时间留给更有迁移价值的能力。
