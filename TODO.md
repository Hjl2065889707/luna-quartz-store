# 技术债务 & 后续优化 TODO

> 更新日期：2026-07-12
>
> 这份清单记录项目当前真实状态。已完成项保留在“已完成”区域，方便回顾项目是如何从学习 demo 逐步收尾成作品集项目的。

## 当前阶段结论

项目已经完成第一轮工程质量收尾：

- `pnpm lint` 通过。
- `pnpm exec tsc --noEmit --pretty false` 通过。
- `pnpm build` 通过。
- Google Fonts 构建依赖已移除。
- Next 16 `middleware` 已迁移为 `proxy`。
- Checkout / webhook / order status 的关键业务链路已做运行时校验和幂等处理。
- `/shop` 和 `/collections/[slug]` 已支持服务端分页。
- 用户可见页面已统一为英文，并应用 Luna & Quartz 水晶独立站视觉系统。
- 移动端 Navbar 已从“桌面端缩窄版”重构为 hamburger drawer + 搜索模式切换。
- 搜索结果已从 quick add 改为点击进入商品详情页，更符合电商搜索预期。
- Checkout success page 移动端底部白色空白已修复。

下一阶段建议进入：

```text
腾讯云部署执行
  -> 子域名 / HTTPS / Nginx
  -> Node.js / pnpm / PM2
  -> 生产环境变量
  -> Prisma / SQLite 初始化
  -> Stripe test checkout
  -> Stripe webhook 入站验收
```

阶段计划详见：[Phase 2：水晶独立站前台重构计划](docs/phase-2-crystal-store-frontend-restructure.md)。
SEO 学习和实施计划详见：[技术 SEO 学习与实施计划](docs/seo-foundation-plan.md)。
腾讯云部署 checklist 详见：[腾讯云部署 Checklist](docs/tencent-cloud-deployment-checklist.md)。

---

## 已完成

### 工程质量

- [x] 修复 `pnpm lint` error 和 warning。
- [x] 修复 TypeScript 类型检查问题。
- [x] 删除废弃的 `data/product.ts`。
- [x] 移除 `next/font/google`，改用系统字体，避免腾讯云构建访问 Google Fonts。
- [x] 配置 `turbopack.root`，消除 Next.js workspace root 推断警告。
- [x] 将 `middleware.ts` 迁移为 `proxy.ts`，消除 Next 16 deprecated warning。

### Checkout 和支付安全

- [x] `checkout/route.ts` 使用 Zod 校验请求体。
- [x] 定义并统一使用 `CheckoutItemSnapshot`。
- [x] 后端重新校验商品是否存在、是否上架、库存、价格和名称。
- [x] Stripe line items 使用后端确认过的商品快照。
- [x] webhook 使用 Stripe 签名验证。
- [x] webhook 根据 `stripeSessionId` 做幂等检查。
- [x] webhook 中使用 `updateMany + stock: { gte: quantity }` 做原子库存扣减。
- [x] 库存不足时自动调用 Stripe refund。
- [x] 库存不足退款后创建 `REFUNDED` 订单。
- [x] success page 根据数据库订单状态显示 `PAID` / `REFUNDED` / processing。
- [x] `REFUNDED` 订单不清空购物车。

### 订单和后台

- [x] Admin 订单状态管理：`PAID -> SHIPPED -> DELIVERED`。
- [x] 订单状态样式、状态列表、状态流转规则集中到 `lib/orderStatus.ts`。
- [x] `PATCH /api/orders/[id]` 使用 Zod 校验订单状态。
- [x] 用户订单页显示退款说明。
- [x] `getUserOrders` 返回准确的 Prisma include 类型，移除页面里的强制类型断言。

### 商品和部署边界

- [x] Admin 新增商品：`POST /api/products` + 表单弹窗 + 图片上传。
- [x] Admin 编辑商品：`PATCH /api/products/[id]` + 复用 ProductDialog。
- [x] Admin 商品上下架使用软删除思路：`isActive`。
- [x] 前台只展示 `isActive: true` 的商品。
- [x] 客户端 API base URL 改成环境变量驱动，移除硬编码 `localhost:3000`。
- [x] 全站金额显示统一为 `AUD`，使用 `formatCurrency()`。
- [x] 准备 24 个水晶商品数据。
- [x] 为 mock 商品配置公开 placeholder 图片 URL。

### 移动端体验和视觉验收

- [x] 移动端 Navbar 改为 hamburger / logo / search icon / cart 的真实电商结构。
- [x] 新增移动端 hamburger drawer，承载主导航、collections、登录/注册入口。
- [x] 移动端搜索改为点击 search icon 后替换 navbar 的搜索模式。
- [x] SearchBar 支持自动 focus，并在选中结果后关闭搜索模式。
- [x] 搜索结果改为商品详情页链接，避免搜索场景直接加购造成意图不清。
- [x] 修复移动端右侧白边和购物车下拉宽度溢出。
- [x] 修复 checkout success page 移动端底部白色空白。

---

## 高优先级 TODO

### 1. 作品集产品化

- [x] 重写 `DESIGN.md`，从 Meta Store 科技零售方向调整为水晶独立站精品生活方式方向。
- [x] 新增 `docs/ui-review-and-refactor-notes.md`，记录 UI review 和重构取舍。
- [x] 重构首页视觉：Hero、trust strip、collections、featured products、crystal guide。
- [x] 新增 `components/shop/ProductCard.tsx` 并升级商品卡片视觉。
- [x] 升级 `/shop` 和 `/collections/[slug]` 页面头部视觉。
- [x] 升级商品详情页信息层级和视觉。
- [x] 统一 SearchBar、Cart、Checkout、Auth、Account、Admin 的英文 UI 和水晶独立站视觉风格。
- [x] 用户可见表单校验、上传、checkout、注册和订单状态错误信息英文化。
- [x] 新增 `docs/phase-2-crystal-store-frontend-restructure.md`，持久化 Phase 2 前台重构计划。
- [x] 新增 `lib/site.ts`，集中维护英文水晶独立站品牌信息。
- [x] 新增 `lib/categories.ts`，集中维护商品分类 slug、数据库值和 SEO 文案。
- [x] 前台 Navbar 从旧的 `Antigravity Store` / `Electronics` / `Lifestyle` 切换为水晶店导航。
- [x] 新增 Footer。
- [x] 新增 About / Crystal Guide / Shipping & Returns / FAQ / Contact 信息页骨架。
- [x] 将 `/` 从商品列表改为 landing page 初版。
- [x] 新增 `/shop` 全部商品页，并支持分页。
- [x] 新增 `/collections/[slug]` 分类页，并支持分页。
- [x] 将 `prisma/seed.ts` 切换为使用 `crystalProductsForSeed`。
- [x] 前台页面文案英文化。
- [x] 统一澳洲电商语境：AUD、shipping、returns、contact、FAQ 等。

### 2. 商品列表分页

- [x] 设计分页参数：`page`、`pageSize`、`totalItems`、`totalPages`。
- [x] 服务端查询改为 `skip` / `take`。
- [x] `/shop` 支持 `?page=` URL 状态。
- [x] `/collections/[slug]` 支持 `?page=` URL 状态。
- [x] 新增可复用 `Pagination` 组件。
- [x] 分页组件支持当前页、Previous / Next、页码、`aria-current` 和禁用态。
- [x] 非法页码通过 `parsePageParam()` 回退到第一页。
- [x] 超过最大页数时返回最后一页数据。
- [ ] 搜索、分类、分页之间保持 URL 状态一致。

### 3. 技术 SEO

- [x] 统一站点 canonical base URL 配置，例如 `NEXT_PUBLIC_SITE_URL`。
- [x] 根布局设置 `metadataBase`、title template、默认 description、Open Graph 和 Twitter card。
- [x] 首页 metadata。
- [x] `/shop` metadata。
- [x] `/collections/[slug]` 动态 metadata 和 canonical。
- [x] `/product/[id]` 动态 metadata 和 canonical。
- [x] Open Graph metadata，至少覆盖首页、分类页、商品详情页。
- [x] `robots.txt`，允许公开页面，屏蔽 admin、checkout、account、API 等不适合索引的路径。
- [x] `sitemap.xml`，包含首页、信息页、shop、collections、active products。
- [x] Product JSON-LD，包含 name、description、image、sku/id、offers、priceCurrency、availability。
- [x] 图片 alt 文案检查，避免空泛或重复。
- [ ] 检查分页页的 canonical / robots 策略，避免无意义重复索引。

### 4. 部署准备

- [x] 重写 README，记录项目定位、技术栈、SEO、支付链路、环境变量和部署注意事项。
- [x] 新增腾讯云部署 checklist，覆盖 Nginx、HTTPS、PM2、SQLite、Stripe webhook、SEO 验收和回滚。
- [ ] 确认腾讯云子域名、HTTPS、Nginx 反向代理方案。
- [ ] 部署后测试 Stripe API 出站访问。
- [ ] 部署后测试 Stripe webhook 入站访问。
- [ ] 决定最终公开 demo 是腾讯云还是 Vercel。
- [ ] 准备生产环境变量清单。

---

## 中优先级 TODO

### 数据模型和订单快照

- [ ] `OrderItem` 存储下单时的 `productName` 和 `productImage`，避免商品后续修改影响历史订单展示。
- [ ] 保存 Stripe `paymentIntentId`。
- [ ] 保存 Stripe `refundId`。
- [ ] 增加 `refundReason`、`refundedAt` 字段。
- [ ] 将订单状态从普通字符串升级为更严格的 enum 或共享 schema。

### 测试

- [ ] 给 checkout API 增加测试。
- [ ] 给 Stripe webhook 增加测试。
- [ ] 测试重复 webhook 不会重复扣库存或重复创建订单。
- [ ] 测试库存不足退款路径。
- [ ] 测试订单状态非法流转。

### 用户体验

- [x] 统一 SearchBar、Cart、Checkout 的水晶独立站视觉风格。
- [ ] 替换商品 placeholder 图片为统一风格的真实/生成商品图。
- [ ] 商品详情页增加 related products。
- [ ] 商品详情页和购物车数量选择器限制最大库存。
- [ ] 缺货时禁用“加入购物车”按钮。
- [ ] 购物车清空逻辑从“清空全部”升级为“只移除已支付商品”。
- [ ] 替换残留的 `alert()` 为 Toast。
- [ ] checkout 页面地址表单英文化并优化澳洲地址字段。

---

## 低优先级 TODO

- [ ] 将 `authOptions` 从 route 文件抽到 `lib/auth.ts`。
- [ ] 收紧 `next.config.ts` 里的图片 `remotePatterns`，不要长期使用 `hostname: '**'`。
- [ ] 根据未来部署方案，把 SQLite 迁移到 PostgreSQL。
- [ ] 将支付和订单逻辑拆成 service 层，方便未来迁移到 C# / ASP.NET Core。
- [ ] 增加邮件通知，例如订单成功和退款通知。
- [ ] 评估 Google OAuth 是否放到海外部署版本实现。
- [ ] Apple OAuth 暂缓，除非后续有明确作品集需求。
