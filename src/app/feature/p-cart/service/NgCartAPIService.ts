import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Cart,cartItem } from '.'


@Injectable({
  providedIn: 'root'
})
export class NgCartApiService {
  private apiServerUrl = environment.apiBaseUrl
  constructor (private http: HttpClient) {}

  public getCartItemByUserId (userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiServerUrl}/cart?userID=${userId}`)
  }

  public getMiniCart (userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/cart/mini?userID=${userId}`)
  }

  public addCartItem (cartItem: cartItem,userId:number): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/cart?&userID=${userId}`, cartItem)
  }

  public deleteCartItem (cartId: String, ItemId: number[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: ItemId
    }
    return this.http.delete<any>(
      `${this.apiServerUrl}/cart?CartID=${cartId}`,
      options
    )
  }

  public updateItemsByAnyFields (
    userId: number,
    itemId: number,
    fieldsArray: any
  ): Observable<Cart> {
    return this.http.patch<Cart>(
      `${this.apiServerUrl}/cart?userID=${userId}&itemID=${itemId}`,
      fieldsArray
    )
  }

}
