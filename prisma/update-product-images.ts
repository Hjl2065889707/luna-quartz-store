import { prisma } from '../lib/prisma'
import { crystalProductsForSeed } from './crystal-products'

async function main() {
  for (const product of crystalProductsForSeed) {
    await prisma.product.updateMany({
      where: { name: product.name },
      data: { image: product.image },
    })
  }

  console.log(`✅ Updated ${crystalProductsForSeed.length} product image paths`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
