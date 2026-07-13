# 腾讯云部署 Checklist：Luna & Quartz

> 更新日期：2026-07-13
>
> 目标：把 Luna & Quartz 部署到腾讯云 CVM，并完整演示 Stripe test checkout + webhook + 订单创建 + 库存扣减链路。

## 0. 当前部署结果

当前 demo 已部署到：

```text
https://shop.huangjunlong.cloud
```

已完成：

- 子域名解析到腾讯云服务器。
- Nginx 反向代理到 Next.js production server。
- HTTPS 证书覆盖 `shop.huangjunlong.cloud`。
- PM2 管理 Next.js 进程。
- Prisma SQLite 生产 demo 数据库初始化。
- Stripe test checkout 跑通。
- Stripe webhook 入站跑通。
- 支付后订单能在用户订单页和后台订单页显示。
- `robots.txt` 和 `sitemap.xml` 使用 HTTPS 线上域名。

## 1. 部署目标

这次部署不是只让页面能访问，而是要完整跑通：

```text
用户加入购物车
  -> checkout
  -> Stripe test mode 付款
  -> Stripe redirect 回 /checkout/success
  -> Stripe webhook POST 到公网 API
  -> 服务端验证 webhook 签名
  -> 数据库创建订单
  -> 库存扣减
  -> success page 显示 PAID / REFUNDED / processing
  -> 用户订单页能看到订单
```

因此核心要求是：

- 有公网 HTTPS 域名。
- 腾讯云服务器能访问 Stripe API。
- Stripe 能访问你的 webhook endpoint。
- 环境变量和 webhook secret 正确。
- 数据库文件和上传目录能持久保存。

## 2. 推荐架构

第一版部署建议：

```text
Browser
  -> HTTPS domain / subdomain
  -> Nginx reverse proxy
  -> Next.js production server on localhost:3000
  -> SQLite local database
  -> public/uploads local files
  -> Stripe API / Stripe webhook
```

组件：

- 腾讯云 CVM：Ubuntu
- Nginx：反向代理和 HTTPS
- Node.js：运行 Next.js
- pnpm：依赖管理
- PM2：进程守护
- SQLite：第一版 demo 数据库
- Stripe test mode：支付和 webhook

## 3. 关键风险

### 3.1 中国大陆服务器访问 Stripe

完整支付链路需要双向网络：

```text
你的服务器 -> Stripe API
Stripe -> 你的服务器 webhook URL
```

服务器上必须测试：

```bash
curl -I https://api.stripe.com
curl -I https://checkout.stripe.com
```

如果腾讯云上海服务器访问 Stripe 不稳定，可能出现：

- 创建 checkout session 失败。
- webhook refund 失败。
- webhook 无法及时处理。

如果这一点无法解决，完整支付 demo 更适合部署到 Vercel、新加坡/香港/日本服务器或其他海外环境。

### 3.2 中国大陆域名备案

如果服务器在中国大陆，公开网站通常涉及备案。你可以使用子域名，但仍要确认：

- 主域名是否已备案。
- 子域名是否需要额外配置。
- 腾讯云控制台和接入规则是否满足。

### 3.3 SQLite 的限制

第一版 demo 可以保留 SQLite，因为部署简单。

但要知道限制：

- 不适合多实例部署。
- 不适合高并发写入。
- 数据库文件要备份。
- 服务器重建时要迁移 `dev.db` 或生产数据库文件。

后续生产化建议迁移到 PostgreSQL。

## 4. 部署前准备

### 4.1 本地确认

本地先保证：

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
```

本地确认功能：

- 商品列表可访问。
- 登录/注册可用。
- 购物车可用。
- Stripe test checkout 可创建 session。
- webhook 本地可以通过 Stripe CLI 或开发环境测试。

### 4.2 确认域名

建议使用子域名：

```text
shop.example.com
crystals.example.com
demo.example.com
```

需要准备：

- DNS A 记录指向腾讯云服务器公网 IP。
- HTTPS 证书。
- Stripe webhook endpoint URL。

Webhook URL 示例：

```text
https://shop.example.com/api/webhooks/stripe
```

## 5. 服务器基础安装

以下以 Ubuntu 为例。

### 5.1 更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

### 5.2 安装基础工具

```bash
sudo apt install -y git curl nginx
```

### 5.3 安装 Node.js

建议使用 Node.js LTS。可以用 NodeSource 或 nvm。

示例：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 5.4 启用 pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

### 5.5 安装 PM2

```bash
sudo npm install -g pm2
pm2 -v
```

## 6. 拉代码和安装依赖

建议部署目录：

```bash
sudo mkdir -p /var/www/luna-quartz
sudo chown -R $USER:$USER /var/www/luna-quartz
cd /var/www/luna-quartz
```

拉代码：

```bash
git clone <your-repo-url> .
```

安装依赖：

```bash
pnpm install
```

如果 `better-sqlite3` 安装失败，可能需要：

```bash
sudo apt install -y build-essential python3
pnpm install
```

## 7. 环境变量

在服务器项目根目录创建：

```bash
nano .env.production
```

示例：

```env
DATABASE_URL="file:./prod.db"

NEXTAUTH_URL="https://shop.example.com"
NEXTAUTH_SECRET="replace-with-strong-random-secret"

NEXT_PUBLIC_SITE_URL="https://shop.example.com"
NEXT_PUBLIC_API_BASE_URL="https://shop.example.com"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

SEED_ADMIN_EMAIL="replace-with-demo-admin-email"
SEED_ADMIN_PASSWORD="replace-with-strong-demo-admin-password"
```

生成 `NEXTAUTH_SECRET` 可以用：

```bash
openssl rand -base64 32
```

注意：

- 不要提交 `.env.production`。
- `NEXT_PUBLIC_SITE_URL` 必须是最终公网 HTTPS 域名。
- `NEXTAUTH_URL` 必须和公网域名一致。
- `STRIPE_WEBHOOK_SECRET` 要来自 Stripe Dashboard 的 webhook endpoint，不是 Stripe CLI 的本地 secret。
- `SEED_ADMIN_PASSWORD` 不要使用公开仓库里出现过的密码。
- 公开 demo 不建议长期暴露可写 admin 账号。

## 8. 数据库初始化

```bash
pnpm prisma generate
pnpm prisma db push
pnpm seed
```

确认数据库文件存在：

```bash
ls -lh prod.db
```

如果使用的是相对 SQLite 路径，数据库文件通常位于项目根目录。

## 9. 构建和启动

### 9.1 构建

```bash
pnpm build
```

### 9.2 用 PM2 启动

```bash
pm2 start pnpm --name luna-quartz -- start
```

查看状态：

```bash
pm2 status
pm2 logs luna-quartz
```

保存 PM2 进程列表：

```bash
pm2 save
pm2 startup
```

`pm2 startup` 会输出一条需要复制执行的命令，按提示执行。

### 9.3 本机端口测试

服务器上测试：

```bash
curl -I http://127.0.0.1:3000
```

如果不通，先看：

```bash
pm2 logs luna-quartz
```

## 10. Nginx 反向代理

创建配置：

```bash
sudo nano /etc/nginx/sites-available/luna-quartz
```

示例：

```nginx
server {
    listen 80;
    server_name shop.example.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/luna-quartz /etc/nginx/sites-enabled/luna-quartz
sudo nginx -t
sudo systemctl reload nginx
```

测试：

```bash
curl -I http://shop.example.com
```

## 11. HTTPS 证书

可以使用腾讯云证书，也可以使用 Certbot。

### 方式 A：Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d shop.example.com
```

测试自动续期：

```bash
sudo certbot renew --dry-run
```

### 方式 B：腾讯云证书

如果使用腾讯云 SSL 证书：

- 在腾讯云申请证书。
- 下载 Nginx 格式证书。
- 上传到服务器。
- 在 Nginx 配置 `ssl_certificate` 和 `ssl_certificate_key`。

第一版建议优先用 Certbot，流程更简单。

HTTPS 完成后测试：

```bash
curl -I https://shop.example.com
```

## 12. Stripe Webhook 配置

进入 Stripe Dashboard：

```text
Developers -> Webhooks -> Add endpoint
```

Endpoint URL：

```text
https://shop.example.com/api/webhooks/stripe
```

监听事件至少包含：

```text
checkout.session.completed
```

创建后复制 Signing secret：

```text
whsec_...
```

写入服务器 `.env.production`：

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

然后重启应用：

```bash
pm2 restart luna-quartz
```

## 13. Stripe 连通性检查

服务器上执行：

```bash
curl -I https://api.stripe.com
curl -I https://checkout.stripe.com
```

再通过浏览器测试：

```text
https://shop.example.com
```

尝试创建 checkout session。如果创建失败，看：

```bash
pm2 logs luna-quartz
```

## 14. 完整支付验收

### 14.1 正常支付路径

1. 打开 `https://shop.example.com`。
2. 登录或注册 demo 用户。
3. 加入商品到购物车。
4. 进入 checkout。
5. 填写地址表单。
6. 跳转 Stripe Checkout。
7. 使用 Stripe test card。

测试卡：

```text
4242 4242 4242 4242
任意未来日期
任意 CVC
任意邮编
```

8. 支付后回到：

```text
/checkout/success?session_id=...
```

9. success page 显示 `PAID` 或先显示 processing 后刷新为 `PAID`。
10. `/account/orders` 能看到订单。
11. Admin orders 能看到订单。
12. 商品库存减少。

### 14.2 Webhook 验收

Stripe Dashboard 查看 webhook delivery：

```text
Developers -> Webhooks -> 你的 endpoint -> Events
```

确认：

- HTTP status 是 `200`。
- 没有持续 retry。
- 服务器 PM2 log 没有 webhook error。

服务器查看：

```bash
pm2 logs luna-quartz
```

### 14.3 库存不足退款路径

手动把某个商品库存调低或制造并发场景后测试。

期望：

- Stripe payment 成功。
- webhook 扣库存失败。
- 服务端创建 test-mode refund。
- 数据库创建 `REFUNDED` 订单。
- success page 显示 refunded 状态。
- 购物车不被清空。

这条路径较复杂，第一版部署可以作为高级验收项。

## 15. SEO 验收

部署后检查：

```bash
curl -I https://shop.example.com
curl https://shop.example.com/robots.txt
curl https://shop.example.com/sitemap.xml
```

检查 sitemap 里 URL 是否是公网域名，不应该是 localhost：

```text
https://shop.example.com/product/...
```

检查商品页 HTML：

```bash
curl https://shop.example.com/product/<id> | grep 'application/ld+json'
```

如果 sitemap 或 canonical 里出现 localhost，说明：

```text
NEXT_PUBLIC_SITE_URL 没有正确配置
```

## 16. 常见问题

### 16.1 Webhook 一直失败

检查：

- Stripe endpoint URL 是否是 HTTPS。
- Nginx 是否正确转发 POST 请求。
- `STRIPE_WEBHOOK_SECRET` 是否来自同一个 endpoint。
- API route 是否能读取 raw body。
- PM2 log 中是否有签名验证失败。

### 16.2 success page 一直 processing

可能原因：

- Stripe webhook 没有打进来。
- webhook 500，Stripe 正在 retry。
- webhook secret 错误。
- 数据库写入失败。
- `stripeSessionId` 没有正确保存。

### 16.3 创建 checkout session 失败

可能原因：

- 服务器访问不了 Stripe。
- `STRIPE_SECRET_KEY` 错误。
- 商品数据没有 seed。
- 商品库存不足。
- API base URL 配置错误。

### 16.4 图片上传后重启丢失

如果上传目录在项目目录内，重新部署或覆盖目录可能导致上传文件丢失。

第一版 demo 可以接受，但后续建议：

- 使用对象存储，例如 R2 / S3 / COS。
- 或将 uploads 目录放到独立持久化路径。

### 16.5 商品图片加载慢

如果商品列表加载很慢，先检查图片体积：

```bash
du -sh public/products public/products/*
```

电商商品图不应该直接使用几 MB 的 PNG。当前项目的 mock 商品图已经从 1254px PNG 转成 1000px WebP，总体积从约 55MB 降到约 2.2MB。

线上更新图片路径时，不要为了改图片路径直接跑 `pnpm seed`，因为当前 seed 会清空订单和订单明细。应该使用：

```bash
pnpm update-product-images
```

这个脚本只根据商品名更新 `Product.image`，不会删除订单。

## 17. 回滚和更新

更新代码：

```bash
cd /var/www/luna-quartz
git pull
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm update-admin-user
pnpm update-product-images
pnpm build
pm2 restart luna-quartz
pm2 save
```

如果更新失败：

```bash
git log --oneline -5
git checkout <previous-commit>
pnpm install
pnpm build
pm2 restart luna-quartz
```

不要轻易删除数据库文件：

```text
prod.db
```

## 18. 后续升级

部署成功后，可以继续做：

- SQLite 迁移 PostgreSQL。
- 图片上传迁移到对象存储。
- checkout / webhook 自动化测试。
- GitHub Actions CI。
- systemd 替代 PM2。
- 后端迁移到 C# / ASP.NET Core Web API。
