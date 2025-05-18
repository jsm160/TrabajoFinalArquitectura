import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.interface';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  userEmail: string = 'desconocido';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCurrentCartItems();
    this.totalPrice = this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userEmail = decoded?.id || 'desconocido';
      } catch (error) {
        console.warn('Token inválido. No se pudo obtener el usuario.');
      }
    }
  }

  confirmPurchase(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.cartItems.length) {
      this.errorMessage = 'El carrito está vacío.';
      return;
    }

    const formattedItems = this.cartItems.map(item => ({
      productId: item.product.id, // ← corregido
      quantity: item.quantity
    }));

    const orderPayload = {
      customerName: this.userEmail,
      products: formattedItems
    };

    this.http.post('http://localhost:3004/api/pedidos', orderPayload).subscribe({
      next: (response: any) => {
        this.successMessage = '✅ Pedido realizado correctamente.';
        this.cartService.clearCart();

        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 2500);
      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        this.errorMessage = error?.error?.message || 'Error al procesar el pedido.';
      }
    });
  }
}
