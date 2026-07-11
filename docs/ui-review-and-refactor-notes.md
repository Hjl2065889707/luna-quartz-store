# UI Review 与水晶独立站重构记录

> 更新日期：2026-07-11

## 结论

项目功能已经具备作品集电商 demo 的骨架，但前台视觉之前存在三个问题：

- `DESIGN.md` 偏 Meta Store / 科技硬件零售，不适合水晶独立站。
- 首页、商品卡片、列表页、详情页的视觉语言不统一。
- 前台虽然有页面结构，但还缺少“精致生活方式独立站”的品牌氛围。

这次重构把方向从：

```text
tech store / clean SaaS retail
```

调整为：

```text
boutique crystal lifestyle store
```

关键词是：

```text
gift-ready
warm editorial
calm wellness
natural materials
clear ecommerce usability
```

## 参考方向

参考了水晶独立站和生活方式电商的常见结构，尤其是：

- 顶部强调 shipping / currency / trust note。
- 导航围绕 Jewellery、Suncatchers、All Products、Crystal Meanings。
- 首页常见 Hero、Collections、Best Sellers、Why Shop With Us、Guide / Testimonials / Newsletter。
- 商品卡片强调图片、名称、价格、quick add、售罄或低库存信息。

本项目不适合做成 marketplace 风格，所以没有走 Etsy 那种高密度筛选页路线。

## 已完成的 UI 重构

### 设计系统

- 重写 `DESIGN.md` 为 Luna & Quartz 水晶独立站方向。
- 定义 Moon Ivory、Charcoal Cocoa、Rose Clay、Sage、Lavender Quartz 等色彩角色。
- 明确避免过度科技感、紫色渐变玄学感、纯 beige 单一配色。

### 首页

- 从简单商品入口升级为 editorial storefront。
- 首屏突出品牌价值主张和真实商品图。
- 新增 trust strip：packed with care、gift-ready catalogue、grounded meanings。
- Collections 区块更像精品店导购入口。
- Featured products 继续复用真实商品数据。
- 新增 Crystal Guide 深色区块，补足品牌可信度和内容入口。

### 商品卡片

- 新增 `components/shop/ProductCard.tsx`。
- `ItemCell` 暂时作为兼容 wrapper 保留，避免一次性重命名影响过大。
- 商品卡片增加：
  - 稳定图片比例。
  - category chip。
  - 低库存提示。
  - 更柔和的边框和 hover。
  - 更像精品电商的 quick add。

### 列表页和分类页

- `/shop` 和 `/collections/[slug]` 的页面头部改成统一的白色 editorial panel。
- 背景切换为 Moon Ivory。
- 分页组件颜色从 Meta Blue 调整为 Rose Clay / Charcoal Cocoa。

### 商品详情页

- 详情页从基础双栏升级为 boutique product detail。
- 增加 category link、availability、currency、demo checkout、care note。
- 增加 Crystal note，说明水晶含义是传统关联和生活方式提示，不是医疗建议。

### 导航和页脚

- Navbar 增加顶部 trust note。
- Brand mark 从纯黑改为 Rose Clay。
- Footer 改为深色 Charcoal Cocoa，提高品牌完成度。

## Code Review 发现

### 已处理

- 分页逻辑已经从页面中抽到 `Pagination` 组件。
- 列表页和分类页都复用分页组件。
- `getActiveProductsByCategory` 已删除，避免保留过时查询函数。
- 分页查询中的 `where` 已提取为局部变量，避免 `count` 和 `findMany` 条件不一致。

### 仍待处理

- `SearchBar` 和 `Cart` 仍保留较多早期 zinc/tech UI 风格。
- `ItemCell` 命名仍偏练习项目，后续可以逐步改所有引用为 `ProductCard`。
- 首页和商品卡片仍受 placeholder 图片质量限制，真实部署前建议换成统一风格图片。
- 商品详情页还没有 related products。
- 信息页内容还是骨架，后续可以补更真实的品牌文案。

## 后续建议

下一步建议处理：

```text
SearchBar / Cart / Checkout 页面视觉统一
```

或者：

```text
Product detail related products + 商品图片资源优化
```

如果目标是“作品集第一眼观感”，优先做 SearchBar、Cart、Checkout 的视觉统一。
