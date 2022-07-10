import { EventEmitter, Injectable } from '@angular/core'
import { BehaviorSubject, Subscription ,from, Observable} from 'rxjs'
import { Users } from 'src/app/model/user'
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
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name))
    } else {
      throw new Error('404')
    }
  }
  deleteLocal (name: string) {
    localStorage.removeItem(name)
  }

  deleteAllLocal () {
    localStorage.clear()
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

      // var date = new Date();
      // date.setTime(date.getTime() + (30 * 1000));
      now.setTime(expireTime)
      this.cookieService.set(name, JSON.stringify(value), now)
    } else {
      this.cookieService.set(name, JSON.stringify(value))
    }
  }
  getCookie (name: string) {
    return this.cookieService.get(name)
      ? JSON.parse(this.cookieService.get(name))
      : undefined
  }
  deleteCookie (name: string) {
    this.cookieService.delete(name)
  }
  deleteAllCookie () {
    this.cookieService.deleteAll()
  }
  getAsyncUserFromCookie (): Observable<Users> {
    return from(this.getPromise())
  }

  getUserFromCookie (): Users{
    return this.getCookie("user")
  }

  getPromise = (): Promise<any> => {
    const session = this.cookieService.get('user') ? JSON.parse(this.cookieService.get('user')) : undefined
    return new Promise(resolve => {
      resolve(session)
    })
  }

  ObservableConvert (cp: any) {
    return from(cp)
  }
  /*
   *
   *
   * used LocalStorage
   *
   *
   */
  deleteAfterLogout(){
    this.deleteLocal("matBadge");
    this.deleteCookie("user")
    this.isLoggin(false);
  }
}
