import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { crystalProductsForSeed } from './crystal-products'

async function main() {
  // 清空商品演示数据前，先删除依赖 Product 的订单明细和订单。
  // 否则已有 OrderItem 会通过外键引用 Product，导致 product.deleteMany() 失败。
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})

  for (const product of crystalProductsForSeed) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log(`✅ Seeded ${crystalProductsForSeed.length} crystal products`)

  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@store.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user seeded: admin@store.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
