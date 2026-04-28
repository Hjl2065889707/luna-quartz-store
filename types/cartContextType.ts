import { CartState } from '@/types/cartState'
import { Product } from '@/types/product'

export interface CartContextType {
  cartState: CartState
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}
