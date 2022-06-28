import {
  Cart,
  cartItem,
  NgCartApiService,
  NgCartCaculatorService,
  cartInit,
  itemInitvalue
} from './index'
import { Injectable } from '@angular/core'
import { SharedService } from 'src/app/service/shared.service'
import { Product } from 'src/app/api/product/product'
import { Users } from 'src/app/model/user'
import { ToastServiceService } from 'src/app/service/toast-service.service'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NgCartService {
  constructor (
    private callAPI: NgCartApiService,
    private cartProcess: NgCartCaculatorService,
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private router: Router
  ) {}

  updateCartQuantity ({ payload, id }: { id: number; payload: any }) {
    const cart: Cart = this.sharedService.getLocal('localCart')

    const items = cart.cartItem.map((item: cartItem) => {
      if (item.id !== id) return item

      return {
        ...item,
        ...payload
      }
    })

    const field = {
      quantityItemNumber: payload.quantity
    }
    cart.userId = this.sharedService.getUserFromCookie()
    const cartGenerator = this.cartProcess.generatorCart(cart, items)
    this.callAPI.updateItemsByAnyFields(cart.userId.id, id, field).subscribe(
      (data: any) => {
        this.cartProcess.saveCartToLocalStorage(cartGenerator)
        this.sharedService.setUniqueItemNumber(parseInt(data.uniqueItemInCart))
        this.toast.showSuccess(data.message)
      },
      error => {
        this.toast.showError(error.error.message)
      }
    )

    return cartGenerator
  }

  addToCart (item: Product) {
    if (this.sharedService.getUserFromCookie()) {
      itemInitvalue.productItem = item
      itemInitvalue.quantity = 1
      itemInitvalue.active = true
      // console.log(itemInitvalue);
      this.cartProcess.saveCartToDB(
        itemInitvalue,
        this.sharedService.getUserFromCookie().id
      )

      console.log('Ok')
    } else {
      this.toast.showWarn('Vui lóng đăng nhập để sử dụng')
      this.router.navigate(['/login'])
    }
  }

  removeAllItem (cartId: any, itemId: number[]): boolean {
    let status = false
    this.callAPI.deleteCartItem(cartId, itemId).subscribe(
      ({ uniqueItemInCart, message }: any) => {
        this.sharedService.setUniqueItemNumber(uniqueItemInCart)
        this.toast.showSuccess(message)
        status = true
      },
      error => {
        this.toast.showError(error.error.message)
      }
    )
    return false
  }

  getCartFromLocalStorage = (): Cart => this.sharedService.getLocal('localCart')

  getCartFromDB (userId: Users) {
    this.callAPI.getCartItemByUserId(userId.id + '').subscribe(
      ({ cartData, isError, message, uniqueItemInCart }: any) => {
        this.sharedService.callFunctionByClick('refreshCart')
        this.cartProcess.saveCartToLocalStorage(
          this.cartProcess.generatorCart(cartData, cartData.cartItem)
        )
        this.sharedService.setUniqueItemNumber(uniqueItemInCart)
      },
      error => {
        this.sharedService.setUniqueItemNumber(0)
      }
    )
  }
}
