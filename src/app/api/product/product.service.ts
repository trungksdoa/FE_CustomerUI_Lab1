import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Product } from './product'

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiServerUrl = environment.apiBaseUrl

  constructor (private http: HttpClient) {}

  public getAllProduct (): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerUrl}/product/all`)
  }
  public getProductByCateId (catid:any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerUrl}/product/category/${catid}`)
  }
  public searchProductByName (theKeyword:String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerUrl}/product/search?name=${theKeyword}`)
  }

  public getOneProduct (id:number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiServerUrl}/product/${id}`
    )
  }

  public addProduct (employee: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiServerUrl}/product/save`,
      employee
    )
  }

  public updateProduct (employee: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiServerUrl}/product/update`,
      employee
    )
  }

  createProductWithFileUpload(formdata: any) {
    return this.http.post<any>(`${this.apiServerUrl}/product/save`, formdata);
  }
  public deleteProduct (employeeId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/product/delete/${employeeId}`
    )
  }
}




