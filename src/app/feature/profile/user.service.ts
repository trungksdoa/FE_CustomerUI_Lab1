import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { Users } from 'src/app/model/user'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl

  constructor (private http: HttpClient) {}

  public loginRequest (user: Users): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/login`, user)
  }
  public Save (user: Users): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/save`, user)
  }
  public update (user: Users): Observable<Users> {
    return this.http.put<Users>(`${this.apiServerUrl}/user/update/${user.id}`, user)
  }
  public triggerCheckIsAdmin (name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiServerUrl}/user/isAdmin?name=${name}`)
  }
  public triggerCheckIsBanned (name: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiServerUrl}/user/banUser?name=${name}`,{})
  }
  public triggerCheckIsDeleted (name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiServerUrl}/user/isDeleted?name=${name}`)
  }
}
