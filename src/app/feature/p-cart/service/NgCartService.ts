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
import { BehaviorSubject, from, Observable, take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NgCartService {
  constructor (
    private callAPI: NgCartApiService,
    private cartProcess: NgCartCaculatorService,
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private router: Router
  ) {}

  updateCartQuantity ({ payload }: { payload: any }) {
    const field = {
      quantityItemNumber: payload.quantityItemNumber,
      id: payload.itemId,
      parentId: payload.parentID
    }
    let cart = null
    return this.callAPI.updateItemsByAnyFields(field)
  }

  addToCart (item: Product) {
    if (this.sharedService.getUserFromCookie()) {
      itemInitvalue.productItem = item
      itemInitvalue.quantity = 1
      itemInitvalue.active = true
      cartInit.cartItem.push(itemInitvalue)
      const data: any = this.cartProcess
        .generatorCart(cartInit, cartInit.cartItem)
        .cartItem.find(x => x.productItem.id === item.id)

      this.cartProcess.saveCartToDB(
        data,
        this.sharedService.getUserFromCookie().id
      )
      // this.cartProcess.saveCartToLocalStorage(cartInit)
    } else {
      this.toast.showWarn('Vui lóng đăng nhập để sử dụng')
      this.router.navigate(['login'])
    }
  }

  removeAllItem (cartId: any, itemId: number[]): boolean {
    let status = false
    this.callAPI.deleteCartItem(cartId, itemId).subscribe(
      ({ uniqueItemInCart, message }: any) => {
        this.toast.showSuccess(message)
        status = true
      },
      error => {
        this.toast.showError(error.error.message)
      }
    )
    return status
  }

  getCartFromDB (userId: Users) {
    this.callAPI.getCartItemByUserId(userId.id + '').subscribe(
      ({ cartData, isError, message, uniqueItemInCart }: any) => {
        this.cartProcess.saveCartToLocalStorage(
          this.cartProcess.generatorCart(cartData, cartData.cartItem)
        )
      },
      error => {
        this.createLocalCart(userId, cartInit)
      }
    )
  }

  getCartLocalSimple = (): Cart => {

    return this.sharedService.getLocal('localCart')
  }

  getPromiseCartLocal = (): Promise<any> => {
    const session = this.sharedService.getLocal
    return new Promise(resolve => {
      resolve(session('localCart'))
    })
  }

  ObservableConvert (cp: any) {
    return from(cp)
  }

  getCartLocal (): Observable<Cart> {
    const subject = new BehaviorSubject<Cart>(null)

    this.ObservableConvert(this.getPromiseCartLocal()).subscribe(
      (data: Cart) => {
        subject.next(this.cartProcess.generatorCart(data, data.cartItem))
      },
      error => {
        this.getAsyncCartFromDB(
          this.sharedService.getUserFromCookie()
        ).subscribe(({ cartData, isError, message, uniqueItemInCart }: any) => {
          this.cartProcess.saveCartToLocalStorage(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
          )
          subject.next(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
          )
        })
      }
    )
    return subject
  }

  getAsyncCartFromDB (userId: Users) {
    return this.callAPI.getCartItemByUserId(userId.id + '')
  }

  createLocalCart (userId: Users, cart: Cart) {
    cartInit.userId = userId
    this.cartProcess.saveCartToLocalStorage(
      this.cartProcess.generatorCart(cart, cart.cartItem)
    )
  }

  deleteCartLocal () {
    this.sharedService.deleteLocal('localCart')
  }
}
