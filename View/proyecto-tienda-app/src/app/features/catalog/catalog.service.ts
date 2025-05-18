import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './catalog.interface'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiCatalogo;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    const headers = this.authHeader();
    return this.http.post<Product>(this.baseUrl, product, { headers });
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const headers = this.authHeader();
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, { headers });
  }

  deleteProduct(id: string): Observable<any> {
    const headers = this.authHeader();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  private authHeader(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
