import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3004/api/pedidos';

  getPedidosPorUsuario(userEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${encodeURIComponent(userEmail)}`);
  }

  crearPedido(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
