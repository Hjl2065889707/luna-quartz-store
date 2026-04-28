import { prisma } from '../lib/prisma'

const products = [
  {
    name: '极简白 Tee',
    price: 129,
    description: '选用 100% 精梳棉，亲肤透气，剪裁利落。',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 50,
  },
  {
    name: '复古黑牛仔夹克',
    price: 499,
    description: '经典水洗工艺，耐穿且不失质感，打造硬朗型格。',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 20,
  },
  {
    name: '智能极简腕表',
    price: 1299,
    description: '冷淡风银黑撞色，蓝宝石镜面，商务与休闲兼顾。',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 15,
  },
  {
    name: '全粒面皮周末包',
    price: 899,
    description: '超大容量设计，手工缝制，短途旅行的不二之选。',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 10,
  },
  {
    name: '降噪无线耳机',
    price: 1999,
    description: '顶尖主动降噪技术，Hi-Fi 音质，享受纯净音乐。',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 30,
  },
  {
    name: '手工陶瓷马克杯',
    price: 88,
    description: '磨砂质感，莫兰迪配色，让喝水也充满仪式感。',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 100,
  },
  {
    name: '透气帆布运动鞋',
    price: 359,
    description: '硫化橡胶底，耐磨防滑，经典的常青款设计。',
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 45,
  },
  {
    name: '极简主义单人椅',
    price: 2499,
    description: '原生木材框架，高回弹海绵，居家美学的点睛之笔。',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400&h=400',
    stock: 5,
  },
]

async function main() {
  // 清空旧数据 (可选)
  await prisma.product.deleteMany({})

  // 插入新数据
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log('✅ Seed 数据填充完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
