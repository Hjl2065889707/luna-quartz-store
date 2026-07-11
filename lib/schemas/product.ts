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
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
})

export type ProductFormValues = z.input<typeof productSchema>
