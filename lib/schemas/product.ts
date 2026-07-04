import * as z from 'zod'
// model Product {
//   id          String   @id @default(cuid())
//   name        String
//   description String
//   price       Float
//   category    String   // 例如: "Headphones", "Keyboards", "Monitors"
//   image       String   // 图片URL
//   stock       Int      @default(1)
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
//   isActive    Boolean  @default(true)

//   orderItems OrderItem[]
// }

export const productSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  description: z.string().min(1, '描述不能为空'),
  category: z.string().min(1, '分类不能为空'),
  price: z.coerce.number().positive('价格不能为负数'),
  image: z.string().url('图片地址不能为空'),
  stock: z.coerce.number().int('库存必须是整数').min(0, '库存不能为负数'),
})

export type ProductFormValues = z.input<typeof productSchema>
