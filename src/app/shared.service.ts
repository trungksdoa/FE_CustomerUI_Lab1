import { EventEmitter, Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'
import { Users } from './model/user'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  afterClick = new EventEmitter()
  shareProduct = new EventEmitter()
  subsVar: Subscription

  private _isLoggedIn = new BehaviorSubject<boolean>(false)
  private _uniqueItemInCart = new BehaviorSubject<number>(0)

  constructor (private cookieService: CookieService) {}
  callFunctionByClick (value?: any) {
    this.afterClick.emit(value)
  }

  openSidePayment2 () {
    this.shareProduct.emit()
  }

  /*
   *
   *
   * other used
   *
   *
   */
  getFormatCurrency (value: number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    })
    return formatter.format(value)
  }
  getFormatDateGTMToLocalDate (date: string) {
    var myDate = new Date(date)
    return myDate.toLocaleString()
  }
  /*
   *
   *
   * check observationTargets
   *
   *
   */
  isLoggin (status: boolean) {
    this._isLoggedIn.next(status)
  }

  isLoggedIn () {
    if (this.getUserFromCookie()) {
      this._isLoggedIn.next(true)
    } else {
      this._isLoggedIn.next(false)
    }
    return this._isLoggedIn.asObservable()
  }

  /*
   *
   *
   * LocalStorage
   *
   *
   */

  setLocal (name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value))
  }
  getLocal (name: string) {
    return localStorage.getItem(name)
      ? JSON.parse(localStorage.getItem(name))
      : ''
  }
  deleteLocal (name: string) {
    localStorage.removeItem(name)
  }
  /*
   *
   *
   * cookies
   *
   *
   */

  setCookie (name: string, value: any) {
    if (name === 'user') {
      var now = new Date()
      var time = now.getTime()
      var expireTime = time + 1000 * 36000
      now.setTime(expireTime)
      this.cookieService.set(name, JSON.stringify(value),expireTime)
    }else{
      this.cookieService.set(name, JSON.stringify(value))
    }

  }
  getCookie (name: string) {
    return this.cookieService.get(name)
      ? JSON.parse(this.cookieService.get(name))
      : ''
  }
  deleteCookie (name: string) {
    this.cookieService.delete(name)
  }

  getUserFromCookie (): Users {
    return this.cookieService.get('user')
      ? JSON.parse(this.cookieService.get('user'))
      : null
  }

  /*
   *
   *
   * used LocalStorage
   *
   *
   */

  setUniqueItemNumber (value: number) {
    this._uniqueItemInCart.next(value)
  }
  getUniqueItemInCart () {
    if (this.getLocal('localCart') !== '') {
      this._uniqueItemInCart.next(this.getLocal('localCart').totalUniqueItems)
    } else {
      this._uniqueItemInCart.next(0)
    }
    return this._uniqueItemInCart.asObservable()
  }

  //
  // getUser (): Users {
  //   return this.getLocal('user')
  // }
}
