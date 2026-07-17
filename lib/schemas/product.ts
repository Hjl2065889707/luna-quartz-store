import * as z from 'zod'

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
