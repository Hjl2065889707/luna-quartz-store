# 技术债务 & 后续优化 TODO

> 记录当前已知的需要优化但暂不影响功能的问题。

## 🔴 类型安全

- [ ] **`checkout/route.ts`** — `req.json()` 返回 `any`，`body` 缺少类型定义。应定义 `CheckoutRequestBody` 接口。
- [ ] **`checkout/route.ts` L15** — `item: any` 应替换为具体类型。
- [ ] **`webhooks/stripe/route.ts`** — `orderItems` 里的 `item` 使用了多次内联类型断言（`item: { productId: string; quantity: number }`），应抽取为统一接口。
- [ ] **统一请求/响应类型** — 所有 API Route 的请求体和响应体都应定义 interface，放在 `types/` 目录下。
- [ ] **引入 Zod** — 对所有 API Route 的请求体做运行时校验（编译时类型检查无法防御恶意/错误请求）。

## 🟡 数据完整性

- [ ] **OrderItem 快照** — `OrderItem` 应存储下单时的 `productName` 和 `productImage`，而非仅存 `productId`。否则商品更新后历史订单数据不准确。
- [ ] **Webhook 库存不足兜底** — 当前 `$transaction` 内未检查 `stock >= quantity`。极端并发场景下可能扣成负数。应加校验，库存不足时自动调用 `stripe.refunds.create()` 退款。
- [ ] **前端库存限制** — 商品详情页和购物车的数量选择器应限制最大值为当前库存。

## 🟢 代码质量

- [ ] **`seed.ts` 删除顺序** — `deleteMany` 需先删 `OrderItem` → `Order` → `Product`，否则外键约束报错。
- [ ] **`productApi.ts` 服务端/客户端混用** — `getProductById` 用了硬编码 `http://localhost:3000` 的绝对路径，部署后会失败。
- [ ] **`authOptions` 导出方式** — 从 `route.ts` 导出 `authOptions` 可能导致 Next.js 打包问题，最佳实践是抽到单独的 `lib/auth.ts`。

## 🔵 功能缺失

- [ ] **Admin 新增商品** — `POST /api/products` + 表单弹窗
- [ ] **Admin 编辑商品** — `PUT /api/products/[id]` + 编辑表单
- [ ] **Admin 订单状态管理** — 支持修改订单状态（PAID → SHIPPED → DELIVERED）
- [ ] **购物车部分支付** — 当前清空整个购物车，应只删除已下单的商品

## 🟣 UX 优化

- [ ] **Toast 通知组件** — 替换所有 `alert()` 调用（如库存不足提示），改用页面内 Toast 通知，提升用户体验。
- [ ] **商品详情页库存显示** — 展示当前库存数量，缺货时禁用"加入购物车"按钮。
