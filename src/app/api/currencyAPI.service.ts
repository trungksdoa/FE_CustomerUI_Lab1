import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  constructor (private http: HttpClient) {}

  public getCurrency (): Observable<any> {
    return this.http.get<any>(`https://open.er-api.com/v6/latest/USD`)
  }


}
