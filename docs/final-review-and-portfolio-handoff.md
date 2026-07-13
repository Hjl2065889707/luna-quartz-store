# 最终 Review 和作品集收尾

> 更新日期：2026-07-13
>
> 结论：当前版本已经可以作为作品集项目暂时封版。后续不建议继续堆功能，除非目标是进入下一阶段学习测试、PostgreSQL、对象存储或 C# / .NET 后端迁移。

## 一、当前项目定位

Luna & Quartz 是一个澳洲语境下的精品水晶独立站 demo。它不是一个真实商业站，而是用来展示全栈开发能力的作品集项目。

当前版本重点展示：

- Next.js App Router 全栈开发。
- 英文 storefront 和 responsive UI。
- 商品分类、分页、详情页和购物车。
- Stripe test checkout。
- webhook 驱动的订单创建。
- 库存校验、原子扣减和幂等处理。
- 库存不足后的 test-mode refund 分支。
- Admin 商品和订单管理。
- SEO metadata、robots、sitemap、Product JSON-LD。
- 腾讯云 CVM + Nginx + HTTPS + PM2 部署。
- 商品图片 WebP 性能优化。

## 二、最终验收结果

已确认通过：

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
```

线上已确认：

- `https://shop.huangjunlong.cloud` 可访问。
- HTTPS 证书覆盖子域名。
- `robots.txt` 输出正确 sitemap。
- `sitemap.xml` 使用线上 HTTPS 域名。
- Stripe test checkout 可以支付成功。
- Stripe redirect 回线上 `/checkout/success`，不再跳 `localhost`。
- Stripe webhook 可以创建订单。
- 用户订单页可看到订单。
- 后台订单页可看到订单。
- 后台页面已经显式动态渲染，不会展示 build 时旧数据。
- Admin seed 凭据已改为环境变量配置，仓库不再保存固定后台密码。
- 线上 admin 密码可以通过 `pnpm update-admin-user` 更新，不需要重新 seed 或清空订单；该脚本会把其他 ADMIN 账号降级为 USER，避免旧演示账号继续拥有后台权限。
- Prisma runtime 已改为读取 `DATABASE_URL`，避免服务器部署时误连本地开发数据库路径。

## 三、封版前修复过的重要线上问题

### 1. Stripe success URL 误跳 localhost

问题：

```text
支付成功后跳转到 https://localhost:3000/checkout/success
```

原因：

checkout API 使用 `req.nextUrl.origin` 推断站点地址。在 Nginx 反向代理后面，这种推断可能受到请求头影响。

修复：

改为使用 `siteConfig.url`，也就是 `NEXT_PUBLIC_SITE_URL`：

```ts
success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
```

最佳实践：

支付回调 URL、canonical URL、sitemap URL 这类公开站点地址不要依赖请求推断，应该由明确环境变量控制。

### 2. Admin 订单页生产环境看不到新订单

问题：

用户订单页能看到订单，但后台订单页看不到。

原因：

Next.js 生产构建会尽量静态化页面。`/admin/orders` 直接查 Prisma，但没有 `cookies()`、`headers()`、`searchParams` 等 Next 能识别的动态信号，所以被 build 成静态页面。

修复：

后台运营页面增加：

```ts
export const dynamic = 'force-dynamic'
```

涉及页面：

- `/admin`
- `/admin/orders`
- `/admin/products`

最佳实践：

后台运营数据通常应该实时读取，不能依赖 build 时静态快照。

### 3. 商品图片加载慢

问题：

商品图片原本是 1254px PNG，24 张合计约 55MB，线上访问明显慢。

修复：

- 转为 1000px WebP。
- 总体积降到约 2.2MB。
- 新增 `pnpm update-product-images`，线上只更新商品图片路径，不清空订单。

最佳实践：

商品列表不要直接使用几 MB 的 PNG。真实项目应在上传阶段做文件大小限制、格式校验、压缩和多尺寸生成。

## 四、当前仍保留的技术债

这些不是当前封版阻塞项，但要在面试或 README 中能解释清楚。

### 1. SQLite 只适合 demo

当前腾讯云单机部署用 SQLite 可以接受，优点是简单、部署成本低。

限制：

- 不适合多实例部署。
- 不适合高并发写入。
- 数据库文件需要备份。

未来升级：

- PostgreSQL。
- Prisma migration。
- 更明确的生产备份策略。

### 2. 订单项缺少商品快照

当前 `OrderItem` 存了：

- `productId`
- `quantity`
- `price`

但还没有保存下单时的商品名和图片。如果商品后续改名或换图，历史订单展示会跟着变。

未来升级：

- `productName`
- `productImage`
- `productCategory`

这是比继续加页面更有业务价值的下一步。

### 3. 缺少关键自动化测试

当前通过手动验收确认支付链路，但还没有测试覆盖：

- checkout API。
- webhook 幂等。
- 库存不足退款分支。
- 订单状态非法流转。

未来如果继续打磨，这是最值得补的工程能力。

### 4. 本地 uploads 不适合 serverless 和多实例

当前 `public/uploads` 适合腾讯云单机 demo。

限制：

- 重新部署可能覆盖文件。
- 多实例不共享文件。
- Vercel 这类 serverless 环境不适合写本地持久文件。

未来升级：

- Tencent COS。
- Cloudflare R2。
- S3。
- CDN。

当前上传 API 已做基础防护：

- 需要 ADMIN session。
- 限制文件大小 5MB。
- 限制 MIME type。
- 校验基础图片文件签名。
- 服务端根据 MIME type 生成扩展名，不信任用户上传文件名。

但它仍然不是生产级上传系统，缺少病毒扫描、限流、对象存储隔离和图片再编码。

### 5. 图片 remotePatterns 仍然偏宽

`next.config.ts` 目前允许任意 HTTPS remote image：

```ts
hostname: '**'
```

当前商品图已经本地化，这个配置可以后续收紧。由于 admin 上传和 demo 阶段还有灵活性，当前不作为封版阻塞项。

## 五、为什么建议准备截图

截图不是代码功能的一部分，但对作品集很有用。

原因：

- 简历或 GitHub README 里一眼能看出这是完整产品，不只是代码仓库。
- 面试官未必会真的跑完整 checkout，截图能快速传达项目质量。
- 线上站点如果临时访问慢、服务器停机或 Stripe test mode 出问题，截图仍然能证明完成度。
- 可以作为你后续重构 .NET 后端前的视觉和功能基线。

建议截图：

- 首页首屏。
- `/shop` 商品分页。
- 商品详情页。
- 移动端导航和搜索。
- Checkout 页面。
- Success page。
- Admin dashboard。
- Admin orders。

截图不用现在强行做成设计稿。先留一组干净截图，后面做 portfolio page 时再精选。

## 六、简历表达

简历 bullet 可以使用：

```txt
Built and deployed a full-stack e-commerce demo with Next.js, TypeScript, Prisma and Stripe, featuring authenticated checkout, webhook-based order processing, atomic stock updates, admin product/order management, technical SEO, WebP image optimization, and deployment on Tencent Cloud with Nginx, HTTPS and PM2.
```

面试展开可以说：

```txt
I used Stripe Checkout for the payment UI, but treated Stripe webhooks as the source of truth for order creation. The backend recalculates product data before creating the checkout session, verifies webhook signatures, handles duplicate webhook delivery with a unique Stripe session id, and performs atomic stock deduction in the database. I also deployed the app on a Tencent Cloud Linux server behind Nginx with HTTPS and PM2.
```

## 七、封版建议

当前建议：

```text
不要继续给这个版本加大功能。
保留 TODO。
准备截图和简历描述。
把下一阶段学习重点转向 C# / ASP.NET Core 后端。
```

未来更好的故事线是：

```text
Version 1:
Next.js full-stack e-commerce demo

Version 2:
Migrate backend to ASP.NET Core Web API + PostgreSQL
```

这样比继续在当前项目里堆小功能更适合全栈求职。
