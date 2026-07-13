# 水晶独立站商品数据方案

本文档记录 24 个商品的数据设计、分类、价格区间和图片策略。商品数据已准备在：

```text
prisma/crystal-products.ts
```

当前采用的是本地 demo 商品图策略：24 个商品使用统一风格的本地 WebP 图片，图片路径维护在 `prisma/crystal-products.ts`。这样既能支撑真实 storefront 视觉，也避免依赖外链图片导致线上加载不稳定。

后续接入 seed 时，优先使用：

```ts
crystalProductsForSeed
```

这个导出已经去掉了仅用于说明的 `imagePrompt` 字段，可以直接作为 Prisma product create 的数据来源。

## 参考方向

参考站点：

```text
https://yourcrystal.com.au/
```

参考到的方向：

- 主要类目包括 bracelets、suncatchers、crystal sets、tumbles、points。
- 手链价格多在 A$34.95 左右。
- Aquamarine 等特殊手链可以略高，例如 A$44.95。
- Suncatcher 和 crystal set 适合做中高价商品。
- 首页内容强调 ethically sourced、affordable、carefully packed、flexible payment 等信任点。

注意：

```text
参考站点用于学习品类、价格带和文案风格，不直接复制商品文案或图片。
```

## 分类设计

本项目先使用 5 个分类：

| Category | 数量 | 定位 |
| --- | ---: | --- |
| Bracelets | 6 | 主力商品，适合首页 best sellers |
| Tumbled Stones | 5 | 低价入门商品，适合提高商品数量和分页价值 |
| Crystal Points | 5 | 中价陈列商品，适合商品详情页展示 |
| Crystal Sets | 4 | 礼盒和组合商品，适合 gifting 场景 |
| Suncatchers | 4 | 高视觉吸引力商品，适合首页视觉升级 |

总数：

```text
24 products
```

这个数量适合后续实现分页，例如：

```text
pageSize = 8
totalPages = 3
```

## 价格策略

价格使用 AUD，并保持真实电商感：

| Category | Price range |
| --- | ---: |
| Tumbled Stones | A$6.95 - A$9.95 |
| Bracelets | A$34.95 - A$44.95 |
| Crystal Points | A$29.95 - A$49.95 |
| Crystal Sets | A$29.95 - A$42.95 |
| Suncatchers | A$34.95 - A$54.95 |

这样设计的原因：

- 有低价商品，购物车更容易组合。
- 有中价商品，订单金额不会过低。
- 有视觉类商品，首页更容易做得像真实独立站。
- 商品价格和 Stripe `AUD` 设置保持一致。

## 图片策略

当前不直接使用参考站点或其他商城的图片，原因是：

- 商城图片通常有版权归属。
- 外链不稳定，后续可能失效。
- 作品集项目最好使用自有、公开可用或明确可商用素材。

当前选择：

```text
本地 WebP 商品图
24 个商品分别配置对应图片
商品名、描述、价格和分类保持真实感
```

这样做的原因：

- 这只是作品集 demo，不会真实下单和发货。
- 当前学习重点是分页、商品页、购物车、支付、订单、SEO 和部署。
- 商品摄影不是这个阶段的核心能力。
- WebP 图片体积较小，适合部署后的商品列表性能。

当前图片状态：

| Item | Status |
| --- | --- |
| Format | WebP |
| Size | 1000 x 1000 |
| Total products | 24 |
| Total product image size | about 2.2MB |
| Original PNG total size | about 55MB |

线上更新图片路径时使用：

```bash
pnpm update-product-images
```

不要为了更新图片路径直接跑 `pnpm seed`，因为当前 seed 会清空订单和订单明细。

## 图片后续替换

如果后面想进一步 polish，可以再替换为：

- 自己用 AI 生成的统一商品图。
- 更高质量的统一 AI 商品摄影。
- 自己拍摄或有明确授权的商品图。
- 对象存储和 CDN 图片。
- 上传时自动生成 thumbnail / medium / large 多尺寸版本。

但这不是当前阶段的高优先级。

## 商品列表

| Name | Category | Price | Stock |
| --- | --- | ---: | ---: |
| Amethyst Calm Bracelet | Bracelets | 34.95 | 18 |
| Rose Quartz Heart Bracelet | Bracelets | 34.95 | 22 |
| Amazonite Flow Bracelet | Bracelets | 34.95 | 16 |
| Black Tourmaline Shield Bracelet | Bracelets | 34.95 | 14 |
| Citrine Confidence Bracelet | Bracelets | 36.95 | 20 |
| Aquamarine Tide Bracelet | Bracelets | 44.95 | 9 |
| Rose Quartz Tumbled Stone | Tumbled Stones | 7.95 | 48 |
| Clear Quartz Tumbled Stone | Tumbled Stones | 6.95 | 56 |
| Labradorite Flash Tumbled Stone | Tumbled Stones | 9.95 | 32 |
| Black Obsidian Tumbled Stone | Tumbled Stones | 6.95 | 41 |
| Carnelian Spark Tumbled Stone | Tumbled Stones | 7.95 | 37 |
| Clear Quartz Clarity Point | Crystal Points | 29.95 | 12 |
| Amethyst Dream Point | Crystal Points | 34.95 | 11 |
| Rose Quartz Heart Point | Crystal Points | 32.95 | 13 |
| Fluorite Focus Point | Crystal Points | 39.95 | 8 |
| Labradorite Aurora Point | Crystal Points | 49.95 | 6 |
| Beginner Crystal Ritual Set | Crystal Sets | 29.95 | 20 |
| Love & Self-Care Crystal Set | Crystal Sets | 34.95 | 16 |
| Protection Crystal Set | Crystal Sets | 36.95 | 15 |
| Seven Chakra Crystal Set | Crystal Sets | 42.95 | 14 |
| Moonlight Prism Suncatcher | Suncatchers | 39.95 | 10 |
| Golden Hoop Crystal Suncatcher | Suncatchers | 34.95 | 12 |
| Celestial Stars Suncatcher | Suncatchers | 49.95 | 8 |
| Infinity Light Suncatcher | Suncatchers | 54.95 | 7 |

## 文案原则

商品描述使用了这种结构：

```text
商品是什么 + 使用场景 + traditional association
```

例如：

```text
A polished amethyst bead bracelet designed for quiet evenings, journaling, and mindful routines.
Amethyst is traditionally associated with calm, clarity, and emotional balance.
```

这里刻意使用：

```text
traditionally associated with
```

而不是直接说：

```text
heals anxiety
cures insomnia
fixes health problems
```

原因：

- 更符合 demo 项目的安全表达。
- 避免医疗功效暗示。
- 面向澳洲市场时，健康/疗愈相关文案要更谨慎。

## 下一步

建议下一步顺序：

1. 修改 `prisma/seed.ts`，使用 `crystalProductsForSeed`。
2. 跑 seed，确认 24 个商品进入数据库。
3. 开始商品列表分页。
4. 再做首页和前台英文化。
