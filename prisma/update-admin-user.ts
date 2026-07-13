import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPasswordRaw = process.env.SEED_ADMIN_PASSWORD

  if (!adminEmail || !adminPasswordRaw) {
    throw new Error(
      'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required for pnpm update-admin-user',
    )
  }

  const password = await bcrypt.hash(adminPasswordRaw, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      password,
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

  console.log(`✅ Admin user updated: ${adminEmail}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
