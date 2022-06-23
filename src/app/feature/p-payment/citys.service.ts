import { City } from '../../model/city'
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiServerUrl = environment.apiBaseUrl

  constructor (private http: HttpClient) {}

  public getImage (imageName: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8081/image/${imageName}`)
  }

  public getCitys (): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiServerUrl}/citys`)
  }
}
