import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { Order, orderItems, orderManagement } from '../../model/Order'
import { environment } from 'src/environments/environment'
import { Chartoption } from 'src/app/model/chartOption'

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiServerUrl = environment.apiBaseUrl

  constructor (private http: HttpClient) {}

  public addCartItem (Order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiServerUrl}/order`, Order)
  }
  public getorders (): Observable<orderManagement[]> {
    return this.http.get<orderManagement[]>(`${this.apiServerUrl}/order`)
  }

  // public getordersByUserId (userId: number): Observable<orderManagement[]> {
  //   return this.http.get<orderManagement[]>(`${this.apiServerUrl}/order?userId=${userId}`)
  // }

  public getOrder (userId: number): Observable<orderManagement[]> {
    return this.http.get<orderManagement[]>(
      `${this.apiServerUrl}/order?userId=${userId}`
    )
  }

  public getChartOption (userId: number): Observable<Chartoption> {
    return this.http.get<Chartoption>(
      `${this.apiServerUrl}/order/profile/chartTotal?userId=${userId}`
    )
  }

  public getTop5OrderByUserId (userId: number): Observable<orderManagement[]> {
    return this.http.get<orderManagement[]>(
      `${this.apiServerUrl}/order/profile/top5Order?userId=${userId}`
    )
  }
  public updateOrder (change: number, orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiServerUrl}/order/status?change=${change}&orderId=${orderId}`,
      {}
    )
  }
}
