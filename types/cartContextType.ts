import { CartState } from '@/types/cartState'
import { Product } from '@/types/product'

export interface CartContextType {
  cartState: CartState
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateCartItemQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}
