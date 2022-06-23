import {
  Cart,
  cartItem,
  NgCartApiService,
  NgCartCaculatorService,
  cartInit,
  itemInitvalue
} from './index'
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { SharedService } from 'src/app/shared.service'
import { Product } from 'src/app/api/product/product'
import { Users } from 'src/app/model/user'
import { SpinnerService } from 'src/app/spinner.service'
import { ToastServiceService } from 'src/app/toast-service.service'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NgCartService {
  constructor (
    private callAPI: NgCartApiService,
    private cartProcess: NgCartCaculatorService,
    private sharedService: SharedService,
    private spinnerServer: SpinnerService,
    private toast: ToastServiceService,
    private router: Router
  ) {}

  updateCartQuantity ({ payload, id }: { id: number; payload: any }) {
    this.spinnerServer.requestStarted()
    const cart: Cart = this.sharedService.getLocal('localCart')

    const items = cart.cartItem.map((item: cartItem) => {
      if (item.id !== id) return item

      return {
        ...item,
        ...payload
      }
    })

    const cartGenerator = this.cartProcess.generatorCart(cart, items)

    const field = {
      quantityItemNumber: payload.quantity,
      productPrice: parseFloat(
        cartGenerator.cartItem
          .find((i: cartItem) => i.id === id)
          .productPrice.toString()
      )
    }

    this.cartProcess.saveCartToLocalStorage(cartGenerator)

    cart.userId = this.sharedService.getUserFromCookie()

    setTimeout(() => {
      this.cartProcess.updateCartToDB(cart.userId.id, id, field)
      this.spinnerServer.requestEnded()
    }, 1010)
    return cartGenerator
  }

  updateCartByClickAddToCart ({id,payload}: { id: number; payload: any }): void {
    const cart: Cart = this.sharedService.getLocal('localCart')
    this.spinnerServer.requestStarted()
    const items = cart.cartItem.map((item: cartItem) => {
      if (item.id !== id) return item

      return {
        ...item,
        ...payload
      }
    })
    // console.log(items);
    const cartDB: Cart = this.cartProcess.generatorCart(cart, items)
    cart.userId = this.sharedService.getUserFromCookie()

    setTimeout(() => {
      console.log(cartDB)
      this.cartProcess.saveCartToDB(cartDB)
      this.spinnerServer.requestEnded()
      this.sharedService.callFunctionByClick('refreshCart')
    }, 1010)
  }

  addToCart (item: Product, quantity = 1) {
    // this.saveCartToLocalStorage(this.setCartItem(item,null))
    if (this.sharedService.getUserFromCookie()) {
      // if (!item.id) throw new Error('You must provide an `id` for items')
      if (quantity <= 0) return
      const cart: Cart = this.sharedService.getLocal('localCart')
        ? this.sharedService.getLocal('localCart')
        : cartInit
      const currentItem = cart.cartItem.find(
        (i: cartItem) => i.productItem.id === item.id
      )

      if (!currentItem && !item.hasOwnProperty('price'))
        throw new Error('You must pass a `price` for new items')

      // ...this.itemInitvalue,
      // this.spinnerServer.requestStarted()

      if (!currentItem) {
        this.spinnerServer.requestStarted()
        const currItem: Cart = {
          ...cart,
          cartItem: [
            ...cart.cartItem,
            {
              ...itemInitvalue,
              quantity: quantity,
              productItem: item,
              id: item.id,
              productPrice: quantity * item.price
            }
          ]
        }

        if (this.sharedService.getUserFromCookie()) {
          setTimeout(() => {
            currItem.userId = this.sharedService.getUserFromCookie()
            this.cartProcess.saveCartToDB(currItem)
            this.spinnerServer.requestEnded()
          }, 1000)
        }
        this.sharedService.callFunctionByClick('refreshCart')
        return
        //End if item is not existing
      }

      const payload = {
        ...currentItem,
        quantity: currentItem.quantity + quantity,
        productItem: item
      }
      console.log('Payload ' + JSON.stringify(payload))
      this.updateCartByClickAddToCart({
        id: currentItem.id,
        payload: payload
      })
    } else {
      this.toast.showWarn('Vui lóng đăng nhập để sử dụng')
      this.router.navigate(['/login'])
    }
  }

  removeAllItem (itemId: number[]) {
    // this.spinnerServer.requestStarted()
    const cart: Cart = this.sharedService.getLocal('localCart')
    this.callAPI.deleteCartItem(cart.id + '', itemId).subscribe(
      ({ uniqueItemInCart, message }: any) => {
        cart.totalUniqueItems = uniqueItemInCart
        this.toast.showSuccess(message)
      },
      error => {
        this.toast.showError(error.error.message)
      }
    )
    this.cartProcess.saveCartToLocalStorage(
      this.cartProcess.generatorCart(
        cart,
        cart.cartItem.filter(item => !itemId.includes(item.id))
      )
    )
    return this.cartProcess.generatorCart(
      cart,
      cart.cartItem.filter(item => !itemId.includes(item.id))
    )
  }

  getCartFromLocalStorage = (): Cart => this.sharedService.getLocal('localCart')

  getCartFromDB (userId: Users) {
    this.callAPI
      .getCartItemByUserId(userId.id + '')
      .subscribe(({ cartData, isError, message, uniqueItemInCart }: any) => {
        if (isError) {
          this.cartProcess.saveCartToLocalStorage(
            this.cartProcess.generatorCart(cartInit, cartInit.cartItem)
          )
          this.sharedService.setUniqueItemNumber(0)
        } else {
          console.log(cartData)
          this.sharedService.callFunctionByClick('refreshCart')
          this.cartProcess.saveCartToLocalStorage(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
          )

          // console.log(object);
          this.sharedService.setUniqueItemNumber(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
              .totalUniqueItems
          )
        }
      })
  }
}
