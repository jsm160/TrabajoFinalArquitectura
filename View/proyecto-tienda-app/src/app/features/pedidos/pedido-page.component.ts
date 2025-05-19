import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoApiService } from './pedido-api.service';

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

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error('Error al obtener pedidos', err)
    });
  }
}
