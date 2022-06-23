import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Cart } from '.'


@Injectable({
  providedIn: 'root'
})
export class NgCartApiService {
  private apiServerUrl = environment.apiBaseUrl
  constructor (private http: HttpClient) {}

  public getCartItemByUserId (userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiServerUrl}/cart?userId=${userId}`)
  }

  public getMiniCart (userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/cart/mini?userId=${userId}`)
  }

  public addCartItem (cartItem: Cart): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/cart`, cartItem)
  }

  public deleteCartItem (cartId: String, ItemId: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: ItemId
    }
    return this.http.delete<any>(
      `${this.apiServerUrl}/cart?CartId=${cartId}`,
      options
    )
  }

  public updateItemsByAnyFields (
    userId: number,
    itemId: number,
    fieldsArray: any
  ): Observable<Cart> {
    return this.http.patch<Cart>(
      `${this.apiServerUrl}/cart?userId=${userId}&itemId=${itemId}`,
      fieldsArray
    )
  }

}
