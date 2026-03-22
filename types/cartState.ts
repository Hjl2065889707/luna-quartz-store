import { CartItem } from '@/types/cartItem'

export interface CartState {
  items: CartItem[]
  totalAmount: number
}
