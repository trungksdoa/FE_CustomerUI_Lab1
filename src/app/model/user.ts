export class Users {
  public id: number
  public name: String
  public username: String
  public password: String
  public address: String
  public phone: String
  public isAdmin: boolean
  public createAt: any
  public lastUpdated: any
  constructor (
    id: number,
    name: String,
    username: String,
    password: String,
    address: String,
    phone: String,
    createAt: any,
  lastUpdated: any
  ) {
    this.id = id
    this.name = name
    this.username = username
    this.password = password
    this.address = address
    this.phone = phone
    this.createAt=createAt
    this.lastUpdated=lastUpdated
  }
}
