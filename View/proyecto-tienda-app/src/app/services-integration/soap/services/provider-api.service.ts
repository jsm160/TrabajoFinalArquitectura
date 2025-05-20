import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderApiService {

  private apiUrl = 'http://localhost:3000/api/provider'; // backend Node

  constructor(private http: HttpClient) {}

  /**
   * Consulta el precio de un producto para un proveedor específico
   */
  checkProductPrice(productId: number, providerId: number): Observable<{ price: number }> {
    return this.http.post<{ price: number }>(`${this.apiUrl}/check-price`, {
      productId,
      providerId
    });
  }

  /**
   * Realiza un pedido de reabastecimiento al proveedor
   */
  makeRestockOrder(productId: number, quantity: number, providerId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/restock`, {
      productId,
      quantity,
      providerId
    });
  }
}

