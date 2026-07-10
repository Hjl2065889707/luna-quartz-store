# Stripe 支付、Webhook、库存和退款设计说明

本文档记录当前项目的支付链路设计。目标不是只解释“代码怎么写”，而是说明为什么这样设计，以及你在面试或作品集介绍中应该如何表达这部分能力。

当前项目定位：

- Next.js full-stack 电商 demo
- Stripe Checkout test mode
- Prisma + SQLite
- 商品库存有限
- 支付成功后通过 webhook 创建订单
- 库存不足时自动退款并创建 `REFUNDED` 订单

相关文件：

- `app/api/checkout/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `app/(checkout)/checkout/success/page.tsx`
- `components/RefreshOrderStatusHelper.tsx`
- `lib/schemas/checkout.ts`
- `lib/orderStatus.ts`
- `prisma/schema.prisma`

## 当前实现状态：2026-07-09

已完成：

- 正常支付路径已联调通过。
- 库存不足自动退款路径已联调通过。
- success page 已根据数据库订单状态展示不同结果。
- `PAID` 订单会清空购物车。
- `REFUNDED` 订单不会清空购物车。
- 用户订单页会显示退款说明。
- Admin 和用户端订单状态样式已统一。
- 订单状态流转规则集中在 `lib/orderStatus.ts`。
- `PATCH /api/orders/[id]` 已使用 Zod 校验请求体。
- 全站金额显示已统一为 `AUD`。

暂未做：

- 重放重复 webhook 的测试暂时跳过。
- 订单表暂未保存 `paymentIntentId`、`refundId`、`refundReason`、`refundedAt`。
- webhook 自动化测试暂未补。

当前学习重点：

```text
理解 checkout 和 webhook 是两条链路；
理解为什么支付成功跳转不等于订单最终成功；
理解 webhook 幂等、库存复查、事务和退款边界。
```

---

## 一、完整支付流程

当前支付流程可以拆成两段：

```text
用户浏览器
  -> 调用 /api/checkout
  -> 后端创建 Stripe Checkout Session
  -> 用户跳转到 Stripe 支付页
  -> Stripe 支付成功
  -> 浏览器跳回 /checkout/success

Stripe 服务器
  -> 调用 /api/webhooks/stripe
  -> 后端验签
  -> 后端创建订单 / 扣库存 / 必要时退款
```

这里最重要的一点是：

```text
success page 的跳转不等于订单已经成功创建。
真正可信的订单状态来自 webhook 处理结果。
```

原因是浏览器跳转和 webhook 是两条不同的链路：

- 浏览器跳转只说明 Stripe Checkout 页面完成了支付流程。
- webhook 才是 Stripe 服务器正式通知我们“这笔支付完成了”。
- webhook 可能比浏览器跳转慢一点。
- webhook 可能失败后重试。
- webhook 可能被重复发送。

所以 success page 不能只显示“支付成功”，而应该根据自己数据库里的订单状态显示结果。

---

## 二、为什么 checkout 接口要重新校验商品信息

前端会把购物车商品提交给 `/api/checkout`，其中包含：

- `productId`
- `name`
- `price`
- `quantity`

但是后端不能直接相信这些数据。

原因：

- 前端数据可以被用户篡改。
- 用户购物车可能是旧数据。
- 商品价格可能已经被管理员修改。
- 商品可能已经下架。
- 库存可能已经变化。

因此 `/api/checkout` 会根据 `productId` 查询数据库，并重新校验：

- 商品是否存在
- 商品是否仍然上架
- 库存是否足够
- 前端提交的价格是否等于数据库价格
- 前端提交的名称是否等于数据库名称

如果不一致，就返回错误，让用户重新确认购物车。

这是电商系统的基础安全原则：

```text
前端负责展示和交互，后端负责最终业务事实。
```

---

## 三、为什么 webhook 里还要再次检查库存

即使 checkout 阶段已经检查过库存，webhook 里仍然必须再次检查。

原因是 checkout 到 webhook 之间存在时间差：

```text
10:00:00 用户 A 创建 checkout session，库存检查通过
10:00:02 用户 B 创建 checkout session，库存检查也通过
10:00:30 用户 A 支付成功
10:00:31 用户 B 支付成功
```

如果库存只有 1 件，那么两个用户在 checkout 时都可能看到“库存足够”，但最终只能有一个人真正买到。

所以库存扣减必须放在 webhook 的订单创建事务里完成，而且要使用原子更新：

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
  throw new InsufficientStockError(item.productId)
}
```

这段代码的关键点：

- `where.stock.gte` 表示只有库存足够时才匹配这条商品记录。
- `decrement` 表示扣库存。
- 这两个动作在同一个数据库更新语句里完成。
- 如果库存不足，数据库不会更新任何记录，`updated.count` 会是 `0`。

这样可以避免先查询库存、再扣库存之间发生并发竞争。

---

## 四、为什么这里用 `updateMany`

虽然我们只更新一个商品，但这里使用 `updateMany` 是有原因的。

Prisma 的 `update` 通常要求唯一条件，例如：

```ts
where: { id: productId }
```

但我们这里需要的条件不是只有 `id`，还包括：

```ts
stock >= quantity
```

也就是说，这次更新的含义是：

```text
只在这个商品库存足够时扣库存。
```

`updateMany` 支持这种非唯一条件组合，并且会返回实际更新了多少条记录。

在当前业务里：

- `updated.count === 1` 表示扣库存成功。
- `updated.count === 0` 表示商品不存在或库存不足。

这是一种常见的并发安全写法。

---

## 五、为什么 webhook 要做幂等

Stripe webhook 可能重复发送。

常见原因：

- 我们的接口没有及时返回 `200`。
- 网络中断。
- 服务器处理到一半报错。
- Stripe 为了可靠性主动重试。

所以 webhook 不能假设“同一个事件只会来一次”。

如果不做幂等，可能出现：

- 重复创建订单
- 重复扣库存
- 重复发货
- 重复退款

当前项目使用 `stripeSessionId` 作为订单唯一键：

```prisma
stripeSessionId String? @unique
```

webhook 创建订单前会先检查：

```text
这个 Stripe session 是否已经有订单？
如果已经有订单，直接结束。
```

这能防止重复 webhook 导致重复订单。

对于退款，当前项目还使用了 Stripe idempotency key：

```ts
await stripe.refunds.create(
  { payment_intent: paymentIntentId },
  { idempotencyKey: `refund_${session.id}` },
)
```

这表示：

```text
同一个 Stripe session 的退款请求，即使被重试，也应该被 Stripe 当成同一次退款操作。
```

这比只靠我们自己的数据库状态更稳，因为退款动作发生在 Stripe 这一侧。

---

## 六、为什么 Stripe API 调用不能放进数据库事务

数据库事务适合包住数据库操作，例如：

- 扣库存
- 创建订单
- 创建订单商品项

但不适合包住外部网络请求，例如：

- 调用 Stripe refund API
- 调用邮件服务
- 调用物流服务

原因：

- 外部请求可能很慢。
- 外部请求可能超时。
- 数据库事务长期占用锁，会影响并发。
- 外部请求成功后，数据库事务仍然可能失败。
- 数据库事务回滚不了已经发送给 Stripe 的退款请求。

所以当前项目采用的顺序是：

```text
尝试在数据库事务中扣库存并创建 PAID 订单
  -> 如果成功，结束
  -> 如果库存不足，事务回滚
  -> 在事务外调用 Stripe refund
  -> 退款成功后创建 REFUNDED 订单记录
```

这是更符合工程实践的边界划分。

---

## 七、库存不足后的自动退款流程

当前 webhook 的库存不足处理逻辑：

```text
1. Stripe 通知 checkout.session.completed
2. 后端验签成功
3. 后端解析 metadata
4. 后端进入数据库事务
5. 尝试扣库存
6. 如果库存不足，抛出 InsufficientStockError
7. 数据库事务回滚
8. 调用 Stripe refund API
9. 创建 REFUNDED 订单
10. 返回 200 给 Stripe
```

这样做的好处：

- 不会出现库存被扣成负数。
- 不会创建错误的 `PAID` 订单。
- 用户支付的钱会被退回。
- 系统里仍然留下 `REFUNDED` 订单，方便用户和管理员查看。
- Stripe 不会因为 500 一直重试同一个 webhook。

注意：真实商业项目里，还应该补充：

- 给用户发送退款通知邮件。
- 在订单里保存 refund id。
- 后台显示退款原因。
- 管理员可以查看退款时间。
- 对接支付失败、退款失败等更多状态。

当前 demo 先做到“自动退款 + 订单可追踪”，已经足够作为作品集项目的亮点。

---

## 八、success page 为什么要查数据库订单状态

用户支付完成后会被 Stripe 跳回：

```text
/checkout/success?session_id=xxx
```

但是这个页面不能直接根据 URL 显示“支付成功”。

更合理的做法是：

```text
拿 session_id 查询数据库订单
  -> 如果订单是 PAID，显示支付成功
  -> 如果订单是 REFUNDED，显示支付已退款
  -> 如果订单还不存在，显示订单处理中
```

当前页面逻辑：

- `PAID`：显示“支付成功”，并清空购物车。
- `REFUNDED`：显示“支付已退款”，不清空购物车。
- 没查到订单：显示“订单处理中”，并自动刷新几次等待 webhook 完成。

为什么 `REFUNDED` 不清空购物车：

```text
用户没有成功买到商品，保留购物车可以让用户调整商品或数量后重新尝试。
```

为什么订单不存在时自动刷新：

```text
浏览器跳回 success page 可能比 webhook 创建订单更快。
短时间自动刷新可以减少用户手动刷新页面的困惑。
```

---

## 九、当前实现的边界和后续改进

当前实现适合作为 portfolio demo，但还不是完整生产级支付系统。

已经完成：

- checkout 阶段后端重新校验商品价格、名称、库存和上架状态。
- webhook 验签。
- webhook 幂等检查。
- webhook 中原子扣库存。
- 库存不足自动 refund。
- 创建 `PAID` / `REFUNDED` 订单。
- success page 根据订单状态显示结果。
- success page 在 webhook 尚未完成时短暂自动刷新。

后续可以继续增强：

- 保存 Stripe `paymentIntentId` 和 `refundId`。
- 增加订单状态枚举，而不是普通字符串。
- 增加 `refundReason`、`refundedAt` 字段。
- 处理 `checkout.session.expired`、`payment_intent.payment_failed` 等事件。
- 给 webhook 增加自动化测试。
- 把支付和订单逻辑拆成 service 层，方便未来迁移到 C# / ASP.NET Core。
- 使用 PostgreSQL 替代 SQLite，练习更接近真实部署的数据库。
- 使用队列或 outbox pattern 处理邮件、通知、库存同步等副作用。

---

## 十、面试中可以怎么讲

可以这样描述这个项目的支付链路：

```text
I built a Stripe Checkout flow where the backend recalculates product data before creating a checkout session, then uses Stripe webhooks as the source of truth for order creation. In the webhook handler, I implemented idempotency using the Stripe session id, performed atomic stock deduction inside a database transaction, and added an automatic refund path when stock becomes insufficient after payment. The success page reads the order status from the database instead of trusting the redirect alone, so it can correctly display paid, refunded, or processing states.
```

中文理解：

```text
我没有只做一个“能跳转 Stripe 支付页”的 demo，而是补齐了真实电商里更关键的部分：
后端价格校验、webhook 验签、重复事件处理、并发库存扣减、库存不足退款，以及前端根据数据库订单状态展示最终结果。
```

这部分比单纯写“集成了 Stripe”更有含金量。

---

## 十一、你应该掌握到什么程度

对于澳洲全栈求职，这一块建议掌握到：

- 能画出 checkout 和 webhook 的两条链路。
- 能解释为什么不能相信前端价格。
- 能解释为什么 webhook 可能重复发送。
- 能解释为什么库存要在 webhook 再检查一次。
- 能解释为什么要用数据库事务。
- 能解释为什么不能把 Stripe refund API 放进数据库事务。
- 能解释 `updateMany + stock: { gte: quantity }` 为什么能避免库存扣成负数。
- 能解释 success page 为什么要查数据库订单状态。

不需要现在就掌握到：

- 自己实现完整支付清结算系统。
- 处理所有 Stripe 事件类型。
- 设计复杂的分布式事务。
- 上队列、Saga、outbox 等大型系统方案。

对这个阶段来说，重点是：

```text
理解支付链路的可靠性问题，并能用简单、清晰、可维护的方式解决核心风险。
```
