export interface CreateOrderBody {
  firstName: string
  lastName: string
  address: string
  phone: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
}
