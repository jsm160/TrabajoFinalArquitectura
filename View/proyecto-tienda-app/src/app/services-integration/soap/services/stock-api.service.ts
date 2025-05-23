import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockApiService {

  private apiUrl = 'http://localhost:3000/api/stock';

  constructor(private http: HttpClient) {}

  /**
   * Verifica si hay suficiente stock de un producto
   */
  verifyAvailability(productId: number, quantity: number): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/check`, {
      productId,
      quantity
    });
  }

  /**
   * Disminuye el stock de un producto
   */
  decreaseStock(productId: number, quantity: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/decrease`, {
      productId,
      quantity
    });
  }

  /**
   * Aumenta el stock de un producto
   */
  increaseStock(productId: number, quantity: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/increase`, {
      productId,
      quantity
    });
  }

getStock(productId: number) {
  const token = localStorage.getItem('authToken');

  const headers = new HttpHeaders(
    token ? { Authorization: `Bearer ${token}` } : {}
  );

  return this.http.get<{ stock: number }>(
    `http://localhost:3000/api/stock/product/${productId}`,
    { headers }
  );
}


}
