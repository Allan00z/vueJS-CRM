import { Product } from "./product"
import { User } from "./user"

export type Order = {
  id: number,
  createdAt:  string,
  totalPrice: number,
  user: User,
  userId: number,
  products: OrderDetails[]
}

type OrderDetails = {
  id: number,
  product: Product,
  productId: number,
  totalPrice: number,
  order: Order,
  orderId: number
  quantity: number
}