import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { crystalProductsForSeed } from './crystal-products'

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPasswordRaw = process.env.SEED_ADMIN_PASSWORD

  if (!adminEmail || !adminPasswordRaw) {
    throw new Error(
      'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required for pnpm seed',
    )
  }

  // Reset dependent order rows before replacing demo product data.
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
  const adminPassword = await bcrypt.hash(adminPasswordRaw, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  await prisma.user.updateMany({
    where: {
      role: 'ADMIN',
      email: { not: adminEmail },
    },
    data: { role: 'USER' },
  })
  console.log(`✅ Admin user seeded: ${adminEmail}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
