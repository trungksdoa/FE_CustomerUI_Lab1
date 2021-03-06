import { Category } from '../category/category'
import { FileDB } from './FileDB'

export interface Product {
  id: number
  name: string
  description: string
  imageurl: string
  price: number
  priceUSD:any
  catagory: Category
  slogan:string
}
