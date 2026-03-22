import { Product } from '@/types/product'

export interface CartItem extends Product {
  quantity: number
}
