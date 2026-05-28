import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

export interface ProductQueryParams {
  _sort?: string;
  _order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(params?: ProductQueryParams): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?._sort) {
      const prefix = params._order === 'desc' ? '-' : '';
      httpParams = httpParams.set('_sort', `${prefix}${params._sort}`);
    }
    return this.http.get<Product[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}