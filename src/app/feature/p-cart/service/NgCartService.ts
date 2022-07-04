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
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NgCartService {
  private cartLocalIsExits = new BehaviorSubject<boolean>(false)
  constructor (
    private callAPI: NgCartApiService,
    private cartProcess: NgCartCaculatorService,
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private router: Router
  ) {}

  isLocalCartExist () {
    if (this.getCartFromLocalStorage()) {
      this.cartLocalIsExits.next(true)
    } else {
      this.cartLocalIsExits.next(false)
    }
    return this.cartLocalIsExits.asObservable()
  }

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
        this.createLocalCart(userId,cartInit)
      }
    )
  }

  getAsyncCartFromDB (userId: Users) {
    return this.callAPI.getCartItemByUserId(userId.id + '')
  }

  createLocalCart (userId:Users,cart:Cart) {
    cartInit.userId = userId;
    this.cartProcess.saveCartToLocalStorage(
      this.cartProcess.generatorCart(cart, cart.cartItem)
    )
    this.sharedService.setUniqueItemNumber(cart.cartItem.length)
  }
}
