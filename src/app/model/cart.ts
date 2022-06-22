import { Users } from './user'
import { Product } from 'src/app/api/product/product'
export interface Cart {
  id: number
  lastUpdated: String
  createAt: String
  cartItem: Array<cartItem>
  userId: Users
  TotalPrice: number
  isEmpty: boolean
  totalUniqueItems: number
}
export interface cartItem {
  id: number
  productItem: Product
  quantity: any
  productPrice: any
  active: boolean
  selected: boolean
}
