import { Injectable } from '@angular/core'
import { NgToastService } from 'ng-angular-popup'
import { Users } from 'src/app/model/user'
import { SharedService } from 'src/app/shared.service'
import { ToastServiceService } from 'src/app/toast-service.service'
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
    this.sharedService.callFunctionByClick('refreshCart')
    this.sharedService.setUniqueItemNumber(
      this.generatorCart(cart, cart.cartItem).totalUniqueItems
    )
  }

  saveCartToDB (cart: Cart) {
    this.callAPI.addCartItem(cart).subscribe(
      ({
        cartData,
        uniqueItemInCart,
        message
      }: {
        uniqueItemInCart: string
        cartData: Cart
        message: string
      }) => {
        this.saveCartToLocalStorage(
          this.generatorCart(cartData, cartData.cartItem)
        )
        this.sharedService.callFunctionByClick('refreshCart')
        // this.sharedService.setUniqueItemNumber(parseInt(uniqueItemInCart))
        this.toast.showSuccess(message)
      },
      responeError => {
        this.toast.showError(responeError.error.message)
      }
    )
  }

  updateCartToDB (userId: number, id: number, field: any) {
    this.callAPI.updateItemsByAnyFields(userId, id, field).subscribe(
      (data: any) => {
        this.sharedService.setUniqueItemNumber(parseInt(data.uniqueItemInCart))
        this.toast.showSuccess(data.message)
      },
      error => {
        this.toast.showError(error.error.message)
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
  selected: false
}
export const cartInit: Cart = {
  id: 0,
  lastUpdated: '',
  createAt: '',
  cartItem: [],
  userId: null,
  TotalPrice: 0,
  isEmpty: false,
  totalUniqueItems: 0
}
