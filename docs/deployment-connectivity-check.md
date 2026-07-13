# 部署连通性预检

这个项目后续会改造成一个可以放进简历的水晶独立站 demo。因为你想用腾讯云上海服务器练习部署，所以在正式决定部署方案之前，需要先确认服务器能不能稳定访问项目依赖的外部服务，尤其是 Stripe。

如果 Stripe 在腾讯云服务器上访问不稳定，就不建议把腾讯云作为最终公开 demo 的部署环境。支付流程一旦在展示时失败，会比较影响作品集效果。

## 当前技术方向

学习价值优先的部署路线：

- Next.js full-stack 应用
- 腾讯云服务器
- 子域名，比如 `shop.example.com` 或 `crystals.example.com`
- Nginx 反向代理
- HTTPS 证书
- Prisma 数据库
- Stripe test mode
- 第一阶段先保留邮箱密码登录
- Google OAuth 等连通性确认后再决定是否加入
- Apple OAuth 暂缓，除非后面有明确需要

主要风险：

中国大陆服务器访问 Stripe、Google 等海外服务时可能不稳定。Stripe 如果不能稳定访问，就会直接影响 checkout 流程。

## 当前结论更新：2026-07-13

最终结果：

- 项目已部署到 `https://shop.huangjunlong.cloud`。
- 子域名、Nginx、HTTPS、PM2 已配置完成。
- Stripe test checkout 已成功创建支付 session。
- Stripe webhook 已能从 Stripe Dashboard 打到腾讯云公网接口。
- 支付成功后订单可以在用户订单页和后台订单页看到。
- Google OAuth 仍不作为腾讯云部署版本核心功能。

因此当前版本可以作为腾讯云部署练习和作品集 demo 使用。

## 历史结论：2026-07-09

初步连通性测试结果：

- 腾讯云服务器访问 Stripe API 成功：`HTTP 200 in 0.666203s`。
- 腾讯云服务器无法访问 Google OAuth 相关地址。
- 腾讯云服务器可以访问 Apple OAuth 相关地址，但 Apple 登录配置成本较高。

当前项目工程状态：

- `pnpm lint` 通过。
- `pnpm exec tsc --noEmit --pretty false` 通过。
- `pnpm build` 通过。
- `next/font/google` 已移除，不再依赖 Google Fonts 构建。
- `middleware.ts` 已迁移为 `proxy.ts`，符合 Next 16 新约定。
- Turbopack workspace root 警告已通过 `next.config.ts` 配置消除。

当前部署建议：

```text
可以继续用腾讯云练习部署。
Stripe API 初步可访问，因此 test mode checkout 有继续验证价值。
Google OAuth 不建议放进腾讯云部署版本的核心功能。
Apple OAuth 暂缓。
```

部署前曾需要确认：

- 子域名是否已备案或符合腾讯云公开访问要求。
- HTTPS 证书是否配置完成。
- Stripe webhook 是否能从 Stripe Dashboard 打到腾讯云公网地址。
- 澳洲访问速度是否能接受。

## 需要测试什么

| 测试项 | 为什么重要 | demo 是否必须 |
| --- | --- | --- |
| Stripe API 出站访问 | 创建 checkout session 时，后端要请求 Stripe | 必须 |
| Stripe webhook 入站访问 | Stripe 需要把支付事件发送到你的接口 | 强烈建议 |
| Google OAuth 出站访问 | NextAuth/Auth.js 需要在服务端和 Google 交换 token、获取用户信息 | 可选 |
| Apple OAuth 出站访问 | Apple 登录也有服务端认证流程 | 可选 |
| DNS 和 HTTPS | OAuth 回调、Stripe webhook、正式 demo 都需要稳定 HTTPS 地址 | 必须 |
| 澳洲访问速度 | 作品集访问者可能在澳洲 | 加分项 |

## 在腾讯云服务器上执行这些测试

下面的命令要在腾讯云服务器上跑，不是在你本地电脑上跑。因为我们关心的是“服务器自己的网络环境”。

### 1. 基础网络和 DNS 测试

```bash
curl -I https://www.cloudflare.com
curl -I https://github.com
```

预期结果：

- 能返回 HTTP 响应。
- TLS/HTTPS 握手成功。
- 命令不会长时间卡住。

如果这一步都失败，说明服务器基础网络就有问题，要先处理服务器网络，再测试 Stripe 和 OAuth。

### 2. Stripe API 连通性测试

先测服务器能不能访问 Stripe：

```bash
curl -i https://api.stripe.com/v1/checkout/sessions
```

预期结果：

- 能收到 Stripe 返回的响应。
- `401 Unauthorized` 是可以接受的，因为这里没有带 API key。
- 如果是 timeout、DNS failure、connection failure、TLS error，说明服务器访问 Stripe 有问题。

更真实的测试方式是用 Stripe test secret key：

```bash
read -s STRIPE_SECRET_KEY
curl -sS -o /tmp/stripe-balance.json -w "HTTP %{http_code} in %{time_total}s\n" \
  -u "$STRIPE_SECRET_KEY:" \
  https://api.stripe.com/v1/balance
```

预期结果：

- `HTTP 200`：最理想，说明 test key 正确，而且服务器可以访问 Stripe。
- `HTTP 401`：通常说明网络是通的，但 key 不对。
- timeout、DNS failure、TLS error：说明服务器不适合直接承载 Stripe checkout。

实际结果：HTTP 200 in 0.666203s

安全提醒：

- 不要把真实 secret key 写进文档、代码、截图或聊天记录。
- 测试时使用 Stripe test key。

### 3. Google OAuth 连通性测试

```bash
curl -I https://accounts.google.com/.well-known/openid-configuration
curl -I https://oauth2.googleapis.com
curl -I https://www.googleapis.com/oauth2/v3/userinfo
```

预期结果：

- 能比较快地返回 HTTP 响应。
- 返回什么状态码不是最关键，关键是服务器能不能连到这些地址。

实际结果：均无法访问

如果这些命令失败或很不稳定，就不要把 Google 登录作为腾讯云部署版本的核心功能。可以保留邮箱密码登录，把 Google OAuth 放到 Vercel 或海外服务器部署版本里。

### 4. Apple OAuth 连通性测试

```bash
curl -I https://appleid.apple.com
curl -I https://appleid.apple.com/auth/keys
```

预期结果：

- 能返回 HTTP 响应。

实际结果：均返回HTTP响应

Apple 登录可能比 Google 更容易连通，但配置成本更高：

- Apple Developer 账号
- Service ID
- HTTPS 域名
- Return/callback URL
- 私钥
- client secret 生成逻辑

这个作品集版本里，Apple 登录优先级低于 Stripe、分页、SEO、部署、项目整体 polish。

### 5. 子域名和 HTTPS 测试

当你给子域名添加 DNS 记录后，可以测试：

```bash
curl -I https://shop.example.com
```

预期结果：

- HTTPS 可以正常访问。
- 证书有效。
- Nginx 能把子域名转发到正确的 Next.js 应用。

OAuth 和 Stripe webhook 都需要一个稳定的 HTTPS 线上地址。

### 6. Stripe Webhook 入站测试

这个测试要等项目部署完成、HTTPS 配好之后才能做。

在 Stripe Dashboard 里配置 test webhook endpoint：

```text
https://shop.example.com/api/webhooks/stripe
```

然后在 Stripe Dashboard 里发送 test event。

预期结果：

- Stripe Dashboard 能收到你的服务器响应。
- `2xx` 表示 webhook 被成功接收。
- `400` 可能表示请求到达了服务器，但签名验证或 payload 处理失败。
- timeout 或 connection failure 表示 Stripe 无法访问你的线上接口。

## 如何根据测试结果做决定

可以使用腾讯云部署，如果：

- 腾讯云服务器能稳定访问 Stripe API。
- 子域名可以正常 HTTPS 访问。
- Stripe webhook 可以打到你的线上接口。
- Google OAuth 要么可用，要么被定义成可选功能。

不建议使用腾讯云作为最终公开 demo，如果：

- Stripe API 请求超时或经常失败。
- Stripe webhook 无法访问你的服务器。
- 海外 API 访问不稳定到会影响 checkout 展示。

如果腾讯云不适合作为最终 demo，可以改用：

- Vercel 部署公开 demo
- Neon 或 Supabase 提供 PostgreSQL
- Cloudflare R2 或 Vercel Blob 存商品图片
- 腾讯云单独作为 Linux/Nginx/Docker 部署练习

这样既不牺牲作品集稳定性，也能保留部署学习价值。

## 推荐项目路线

Phase 1：Code review 和作品集差距分析。（已完成）

Phase 1.5：工程质量和支付链路收尾。（已完成）

- lint / typecheck / build 通过
- Checkout API 运行时校验
- Stripe webhook 幂等
- 原子库存扣减
- 库存不足自动退款
- success page 根据订单状态展示结果
- 订单状态流转集中管理

Phase 2：把项目改造成英文水晶独立站 demo。（下一阶段）

Phase 3：准备 24 个商品，实现商品列表分页。（下一阶段重点学习）

Phase 4：加入技术 SEO：

- 全站 metadata
- 商品详情页动态 metadata
- Open Graph metadata
- `robots.txt`
- `sitemap.xml`
- Product JSON-LD
- 图片 alt 文案

Phase 5：腾讯云部署。

Phase 6：根据线上测试决定最终公开 demo 方案：

- 如果 Stripe 和 HTTPS 都稳定，就部署到腾讯云。
- 如果腾讯云影响支付流程，就用 Vercel 做最终公开 demo。

## 简历定位

可以这样描述这个项目：

```text
Built and deployed a production-style crystal e-commerce demo with Next.js, Prisma, authentication, admin product management, paginated catalog, Stripe test checkout, technical SEO, and Linux/Nginx deployment preparation.
```

如果腾讯云部署成功，可以加：

```text
Deployed the application to a cloud Linux server using Nginx reverse proxy, HTTPS, environment-based configuration, and production build management.
```

如果最终使用 Vercel 部署，可以写：

```text
Deployed the application with a serverless Next.js workflow and externalized database/storage services for production readiness.
```
