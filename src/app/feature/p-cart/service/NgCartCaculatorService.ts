import { Injectable } from '@angular/core'
import { NgToastService } from 'ng-angular-popup'
import { Users } from 'src/app/model/user'
import { SharedService } from 'src/app/service/shared.service'
import { ToastServiceService } from 'src/app/service/toast-service.service'
import { Cart, cartItem, NgCartApiService } from './index'

@Injectable({
  providedIn: 'root'
})
export class NgCartCaculatorService {
  constructor (
    private sharedService: SharedService,
    private callAPI: NgCartApiService,
    private toast: ToastServiceService
  ) {}

  saveCartToLocalStorage (cart: Cart) {
    this.sharedService.setLocal(
      'localCart',
      this.generatorCart(cart, cart.cartItem)
    )
  }

  saveCartToDB (cart: cartItem,userId:number) {
    this.callAPI.addCartItem(cart,userId).subscribe(
      ({
        cartData,
        uniqueItemInCart,
        message
      }: {
        uniqueItemInCart: string
        cartData: Cart
        message: string
      }) => {
        this.saveCartToLocalStorage(cartData)
        this.sharedService.setUniqueItemNumber(parseInt(uniqueItemInCart))
        this.toast.showSuccess(message)
      },
      responeError => {
        this.toast.showError(responeError.error.message)
      }
    )
  }

  generatorCart = (cart: Cart, items: cartItem[]) => {
    const totalUniqueItems = this.calculateUniqueItems(items)
    const isEmpty = totalUniqueItems === 0
    return {
      ...cartInit,
      ...cart,
      cartItem: this.calculateItemTotals(items),
      totalUniqueItems,
      TotalPrice: this.calculateTotal(items),
      isEmpty
    }
  }

  calculateItemTotals = (items: cartItem[]) =>
    items.map(item => ({
      ...item,
      productPrice: item.productItem.price * item.quantity!
    }))

  calculateTotal = (items: cartItem[]) =>
    items.reduce(
      (total, item) => total + item.quantity! * item.productItem.price,
      0
    )

  calculateUniqueItems = (items: cartItem[]) => items.length
}
export const itemInitvalue: cartItem = {
  id: 0,
  productItem: null,
  quantity: 0,
  productPrice: 0,
  active: false,
  selected: false,
  lastUpdated: undefined,
  createAt: undefined
}
export const cartInit: Cart = {
  id: 0,
  cartItem: [],
  userId: null,
  TotalPrice: 0,
  isEmpty: false,
  totalUniqueItems: 0,
  lastUpdated: undefined,
  createAt: undefined
}
