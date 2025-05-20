import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoApiService } from './pedido-api.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/auth/auth.service'; 

@Component({
  selector: 'app-pedido-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-page.component.html',
  styleUrls: ['./pedido-page.component.css']
})
export class PedidoPageComponent implements OnInit {
  pedidos: any[] = [];
  private pedidoService = inject(PedidoApiService);
  private authService = inject(AuthService); 

  ngOnInit(): void {
    const token = this.authService.getToken(); 

    if (!token) {
      console.error('No hay token disponible (desde PedidoPageComponent)'); 
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log('Token decodificado:', decoded);

      const userEmail = decoded.email;

      if (!userEmail) {
        console.error('El token no contiene el campo "email"');
        return;
      }

      console.log('Usando email:', userEmail);

      this.pedidoService.getPedidosPorUsuario(userEmail).subscribe({
        next: (data) => {
          console.log('Pedidos recibidos:', data);
          this.pedidos = data;
        },
        error: (err) => console.error('❌ Error al obtener pedidos', err)
      });

    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }
}