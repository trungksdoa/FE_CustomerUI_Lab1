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
    } else {
      this.toast.showWarn('Vui lóng đăng nhập để sử dụng')
      this.router.navigate(['Login'])
    }
  }

  removeAllItem (cartId: any, itemId: number[]): Promise<any> {
    return new Promise(resolve => {
      this.callAPI.deleteCartItem(cartId, itemId).subscribe(
        ({ cartData, uniqueItemInCart, message }: any) => {
          this.toast.showSuccess(message)
          this.cartProcess.saveBadge(uniqueItemInCart)
          cartData = this.cartProcess.generatorCart(cartData, cartData.cartItem)
          resolve({
            cartData,
            message,
            uniqueItemInCart
          })
        },
        error => {
          this.toast.showError(error.error.message)
          resolve({})
        }
      )
    })
  }

  callAPIChangeData (
    currentQuantity: number,
    itemId: number,
    parentID: number
  ): Promise<any> {
    return new Promise(resolve => {
      this.updateCartQuantity({
        payload: {
          itemId: itemId,
          quantityItemNumber: currentQuantity,
          parentID: {
            Id: parentID
          }
        }
      }).subscribe(
        ({
          cartData,
          message,
          uniqueItemInCart
        }: {
          cartData: Cart
          message: string
          uniqueItemInCart: number
        }) => {
          cartData = this.cartProcess.generatorCart(cartData, cartData.cartItem)
          resolve({
            cartData,
            message,
            uniqueItemInCart
          })
          this.cartProcess.saveBadge(uniqueItemInCart)
          this.toast.showSuccess(message)
        },
        error => {
          resolve({})
          this.toast.showError(error.error.message)
        }
      )
    })
  }

  getMiniCart = (): Observable<any> => {
    return from(this.getPromise())
  }

  getPromise = async (): Promise<any> => {
    const session = this.sharedService.getLocal
    return await new Promise(resolve => {
      resolve(session('matBadge'))
    })
  }

  ObservableConvert (cp: any) {
    return from(cp)
  }

  getAsyncCartFromDB (userId: Users) {
    return this.callAPI.getCartItemByUserId(userId.id + '')
  }

}
