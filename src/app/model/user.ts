import { Cart } from "./cart"

export class Users {
   id: number
   name: String
   username: String
   password: String
   address: String
   phone: String
   isAdmin: boolean
   cart:Cart
  constructor (
    id: number,
    name: String,
    username: String,
    password: String,
    address: String,
    phone: String
  ) {
    this.id = id
    this.name = name
    this.username = username
    this.password = password
    this.address = address
    this.phone = phone
  }
}

export class UserUpdate {
   id: number
   name: String
   password: String
   address: String
   phone: String
   isAdmin: boolean
}
