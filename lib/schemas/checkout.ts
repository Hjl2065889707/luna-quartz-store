import * as z from 'zod'

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
})

export const checkoutItemSnapshotSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
})

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSnapshotSchema).min(1),
  shippingInfo: checkoutSchema,
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type CheckoutItemSnapshot = z.infer<typeof checkoutItemSnapshotSchema>
export type CheckoutRequestBody = z.infer<typeof checkoutRequestSchema>
