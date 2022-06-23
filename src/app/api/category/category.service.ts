import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class CategoryService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiServerUrl}/catagory/all`);
  }

  public addCategory(cate: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiServerUrl}/catagory/save`, cate);
  }

  public updateCategory(cate: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiServerUrl}/catagory/update`, cate);
  }

  public deleteCategory(cateid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/catagory/delete/${cateid}`);
  }
}
