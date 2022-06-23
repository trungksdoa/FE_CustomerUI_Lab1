import { Product } from '../api/product/product';
import { Users } from "./user"

export interface orderItems{
  id: number
  productItem: Product
  quantity: any
  productPrice: any
}

export interface Order {
  id: number
  orderItems: Array<orderItems>
  phoneNumber:string
  fullname:string
  address:string
  userId: Users
  city:string
  wards:string
  district:string
  note:string
  status:number
  totalAmount:number
}


export interface orderManagement extends Order {
  createAt:any
  lastUpdated:any
}
