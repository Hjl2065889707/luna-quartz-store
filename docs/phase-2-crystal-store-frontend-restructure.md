# Phase 2：水晶独立站前台重构计划

> 更新日期：2026-07-11
>
> 目标：把项目从“商品列表练习”重构成一个更像真实水晶独立站的作品集 demo，同时保留 Next.js 全栈、Stripe test mode、后台商品管理和订单链路。

## 阶段目标

这一阶段的重点不是继续堆后端功能，而是补齐真实独立站需要的信息架构、页面层次、品牌观感和基础 SEO。

完成后，面试官打开项目时应该能看到：

- 一个清晰的水晶品牌首页，而不是直接堆满商品。
- 可以按分类浏览商品。
- 可以分页浏览全部商品。
- 有 About、FAQ、Shipping & Returns、Contact、Crystal Guide 等信息页。
- 商品详情、购物车、结账、订单状态仍然能跑通。
- 页面文案以英文为主，更符合澳洲求职作品集语境。

## 推荐站点结构

```text
/
  Landing page 首页

/shop
  所有商品列表，带分页

/collections/bracelets
/collections/tumbled-stones
/collections/crystal-points
/collections/crystal-sets
/collections/suncatchers
  分类商品页，后续带分页

/product/[id]
  商品详情页，当前先保留 id 路由，后续可以升级为 slug

/about
  品牌故事

/crystal-guide
  水晶入门和选择指南

/shipping-returns
  配送与退换说明

/faq
  常见问题

/contact
  联系页面

/account/orders
/checkout
/checkout/success
  保留现有业务页面
```

## 首页应该承担的职责

首页不应该承担“展示所有商品”的职责。真实独立站的首页更像一个导购入口：

- Hero：品牌名、价值主张、主 CTA。
- Featured Collections：按分类进入商品列表。
- Featured Products：只展示少量精选商品。
- Why Choose Us：建立信任，例如 careful packing、AUD pricing、test checkout demo。
- Crystal Guide Preview：引导用户阅读选择指南。
- Footer：统一承接 About、Shipping、FAQ、Contact 等信息。

## 技术拆分建议

### 配置层

- `lib/site.ts`：品牌名、描述、导航、信息页链接。
- `lib/categories.ts`：分类 slug、展示名、描述、SEO 文案。

这些配置本身学习收益不高，但能让项目更像真实工程：页面不要到处手写字符串，后续改品牌、改分类时集中维护。

### 查询层

建议后续扩展 `api-client/productApi.server.ts`：

- `getPaginatedProducts({ page, pageSize })`
- `getProductsByCategory({ category, page, pageSize })`
- `getFeaturedProducts()`
- `getCategoryCounts()`

这部分值得你学习，因为它涉及真实业务常见的服务端分页、URL 状态、数据库查询和 SEO 页面生成。

### 组件层

建议逐步新增：

- `components/layout/Footer.tsx`
- `components/shop/ProductCard.tsx`
- `components/shop/ProductGrid.tsx`
- `components/shop/Pagination.tsx`
- `components/shop/CategoryNav.tsx`
- `components/home/Hero.tsx`
- `components/home/FeaturedCollections.tsx`
- `components/home/FeaturedProducts.tsx`

## 哪些我可以直接帮你做

这些部分主要是工程整理、文案和页面骨架，学习收益相对低，可以直接代做：

- 品牌配置文件。
- 分类配置文件。
- Navbar 英文化和链接调整。
- Footer。
- About / FAQ / Shipping & Returns / Contact / Crystal Guide 静态页面初版。
- 全局 metadata 从旧品牌切到水晶店。
- 清理旧的 `Antigravity Store`、`Electronics`、`Lifestyle` 前台痕迹。

## 哪些建议你重点学习

这些更适合作为下一阶段学习重点：

- `/shop` 商品分页。
- `/collections/[slug]` 分类页。
- URL search params 如何驱动服务端查询。
- `skip / take / count` 分页查询。
- 分页 UI 如何处理第一页、最后一页、非法 page。
- 分类页和商品页 metadata。
- 后续把 `/product/[id]` 升级为 `/product/[slug]` 的数据迁移思路。

## 推荐执行顺序

### Step 1：低学习成本基础设施

- [x] 写入本阶段计划文档。
- [x] 新增品牌配置。
- [x] 新增分类配置。
- [x] 新增 Footer。
- [x] 新增信息页骨架。
- [x] 更新 Navbar 和全局 metadata。

### Step 2：首页重构

- [x] 把 `/` 从商品列表改成 landing page。
- [x] 首页展示分类入口。
- [x] 首页只展示精选商品，而不是全部商品。

### Step 3：商品列表分页

- [x] 新增 `/shop`。
- [x] 实现服务端分页查询。
- [x] 实现 Pagination 组件。
- [x] 处理非法页码。
- [x] 超过最大页数时返回最后一页数据。
- [x] 使用 query string：`/shop?page=2`。

### Step 4：分类页

- [x] 新增 `/collections/[slug]`。
- [x] 根据 slug 映射数据库 category。
- [x] 分类页支持分页。
- [x] 分类页生成动态 metadata。

### Step 5：视觉和 SEO 收尾

- [ ] 商品卡片英文化和视觉统一。
- [ ] 商品详情页英文化和信任信息补充。
- [ ] 基础 SEO metadata。
- [ ] 后续考虑 sitemap、robots、Product JSON-LD。

## 简历表达方向

这一阶段完成后，可以把项目描述成：

```text
Built a portfolio-ready e-commerce storefront with Next.js, TypeScript, Prisma and Stripe, including landing pages, collection-based browsing, paginated product listing, persisted cart state, checkout flow, webhook-based order updates, and admin product management.
```

重点不是说“我做了几个页面”，而是强调你理解真实电商站的信息架构、商品浏览路径、支付和订单链路。
