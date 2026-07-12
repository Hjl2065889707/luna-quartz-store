# 技术 SEO 学习与实施计划

> 更新日期：2026-07-12
>
> 目标：把 Luna & Quartz 从“能访问的作品集页面”收尾成“搜索引擎能理解、能抓取、能展示关键信息”的 Next.js 电商 demo。

## 为什么现在做 SEO

UI 已经接近收尾，页面结构也稳定了。现在做 SEO 比较合适，因为：

- 首页、shop、collection、product、information pages 已经存在。
- 商品数据和分类数据已经集中维护。
- App Router 支持用 `metadata`、`generateMetadata`、`robots.ts`、`sitemap.ts` 做工程化 SEO。
- 这部分可以写进简历，体现你理解 SSR/SSG、动态 metadata、结构化数据和上线前收尾。

## SEO 不是玄学

这个项目里先把 SEO 理解成三件事：

```text
让搜索引擎找到页面
让搜索引擎理解页面
让用户在搜索结果里愿意点击页面
```

不要把 SEO 理解成“堆关键词”。对作品集项目来说，最重要的是技术基础正确、页面语义清楚、内容可信。

## 核心概念

### 1. Crawling：抓取

搜索引擎 crawler 会通过链接、sitemap、外部入口发现页面。

本项目对应任务：

- 页面之间要有真实 `<Link>` 可达路径。
- `sitemap.xml` 要列出重要公开页面。
- 不要让 admin、checkout、account、API 这类页面进入 sitemap。

### 2. Indexing：索引

页面被抓到之后，搜索引擎决定是否把它放进索引。

本项目对应任务：

- 公开页面要能服务端渲染出主要内容。
- 不适合公开索引的页面要通过 `robots` 或 metadata 控制。
- 商品详情页、分类页要有独立 title、description 和 canonical。

### 3. Ranking：排名

排名受很多因素影响。作品集 demo 不追求真实商业排名，但要体现工程基础。

本项目对应任务：

- 页面标题清楚。
- 页面描述自然。
- URL 和页面结构合理。
- 商品内容真实、图片 alt 有意义。
- 页面加载和移动端体验不要明显拖后腿。

### 4. SERP Appearance：搜索结果展示

搜索结果里通常会显示 title、snippet、URL、图片或 rich result。

本项目对应任务：

- metadata title 和 description。
- Open Graph / Twitter card，方便社交分享。
- Product JSON-LD，帮助搜索引擎理解商品名称、图片、价格、库存状态。

## Next.js 里怎么做

### 静态 metadata

适合首页、shop、about、faq、contact 这类内容相对固定的页面。

```ts
export const metadata = {
  title: 'Shop Crystals | Luna & Quartz',
  description: 'Browse crystal bracelets, tumbled stones and ritual sets.',
}
```

### 动态 metadata

适合分类页和商品详情页，因为 title 和 description 需要根据数据库或 slug 生成。

```ts
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id)

  return {
    title: `${product.name} | Luna & Quartz`,
    description: product.description,
  }
}
```

### robots.ts

用于生成 `/robots.txt`。

这个项目建议：

- allow: `/`
- disallow: `/admin`
- disallow: `/checkout`
- disallow: `/account`
- disallow: `/api`

注意：`robots.txt` 主要控制 crawling，不是绝对的隐私保护。真正不能公开的内容要靠登录权限。

### sitemap.ts

用于生成 `/sitemap.xml`。

这个项目建议包含：

- `/`
- `/shop`
- `/about`
- `/crystal-guide`
- `/shipping-returns`
- `/faq`
- `/contact`
- 所有 `/collections/[slug]`
- 所有 active product detail pages

### Product JSON-LD

商品页可以输出结构化数据，让搜索引擎更明确地理解这是一个商品。

字段建议：

- `@context`
- `@type: Product`
- `name`
- `description`
- `image`
- `sku` 或 `id`
- `offers`
- `price`
- `priceCurrency: AUD`
- `availability`

因为这是 demo，先不做 review rating，避免伪造评价。

## 本项目执行顺序

### Step 1：站点 URL 和全局 metadata

- 新增或确认 `NEXT_PUBLIC_SITE_URL`。
- 在根 layout 配置 `metadataBase`。
- 设置 title template。
- 设置默认 description。
- 设置默认 Open Graph。

### Step 2：页面级 metadata

- 首页。
- Shop。
- Collections。
- Product detail。
- 信息页。

### Step 3：robots 和 sitemap

- 新增 `app/robots.ts`。
- 新增 `app/sitemap.ts`。
- sitemap 查询 active products。
- 排除后台、账户、checkout、API。

### Step 4：Product JSON-LD

- 在 product detail page 输出 JSON-LD。
- 用后端商品数据生成字段。
- 不加入虚假的 rating/review。

### Step 5：验收

- `pnpm lint`
- `pnpm exec tsc --noEmit --pretty false`
- `pnpm build`
- 浏览 `/robots.txt`
- 浏览 `/sitemap.xml`
- 查看商品页 HTML 是否包含 JSON-LD

## 简历表达

可以写：

```text
Implemented SEO-ready e-commerce pages in Next.js App Router, including dynamic metadata, canonical URLs, sitemap.xml, robots.txt, Open Graph metadata and Product JSON-LD structured data.
```

这比只写“做了 SEO”专业很多，因为它说清楚了你具体做了哪些技术实现。

## 暂时不做什么

- 不做复杂关键词研究。
- 不做 Google Search Console 实站数据分析，除非项目已经部署并稳定收录。
- 不伪造商品 review/rating。
- 不为了 SEO 把页面文案堆满重复关键词。
- 暂时不把 `/product/[id]` 改成 `/product/[slug]`，但可以在文档里说明这是后续优化方向。
