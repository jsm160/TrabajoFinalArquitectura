import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.interface';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    MatSnackBarModule 
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  userEmail: string = 'desconocido';

  nombreTitular: string = '';
  numeroTarjeta: string = '';

  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar 
  ) { }

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
        this.userEmail = decoded?.email || 'desconocido';
      } catch (error) {
        console.warn('Token inválido. No se pudo obtener el usuario.');
      }
    }
  }

  confirmPurchase(): void {
   
    this.isLoading = true;

    if (!this.nombreTitular || !this.numeroTarjeta || this.cartItems.length === 0) {
      this.showSnackbar('Faltan datos de pago o el carrito está vacío.', 'Cerrar', 'error-snackbar'); 
      this.isLoading = false;
      return;
    }

    if (!/^\d{4}$/.test(this.numeroTarjeta)) {
      this.showSnackbar('El número de tarjeta debe ser de 4 dígitos numéricos.', 'Cerrar', 'error-snackbar');
      this.isLoading = false;
      return;
    }

    const paymentPayload = {
      cardNumber: this.numeroTarjeta,
      cardHolderName: this.nombreTitular,
      amount: this.totalPrice
    };

    console.log('💳 Enviando solicitud de pago al banco:', paymentPayload);

    this.http.post('http://localhost:3001/api/payments', paymentPayload).subscribe({
      next: (paymentResponse: any) => {
        if (paymentResponse.success) {
          console.log('Pago aprobado por el banco:', paymentResponse);

          const formattedProducts = this.cartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
          }));

          const orderPayload = {
            customerName: this.userEmail,
            products: formattedProducts,
            totalPrice: this.totalPrice
          };

          console.log('Pago aprobado, enviando pedido al backend:', orderPayload);

          this.http.post('http://localhost:3004/api/pedidos', orderPayload).subscribe({
            next: (orderCreationResponse: any) => {
              this.showSnackbar('Pedido y pago procesados correctamente.', 'Cerrar', 'success-snackbar');
              this.cartService.clearCart();
              this.isLoading = false;

              setTimeout(() => {
                this.router.navigate(['/catalog']);
              }, 2500);
            },
            error: (orderError) => {
              this.isLoading = false;
              console.error('❌ Error al crear pedido después del pago:', orderError);
              const msg = orderError?.error?.message || 'Error al procesar el pedido después de aprobar el pago.';
              this.showSnackbar(msg, 'Cerrar', 'error-snackbar'); 
            }
          });
        } else {
          this.isLoading = false;
          const msg = paymentResponse?.message || 'El pago fue rechazado por una razón desconocida.';
          this.showSnackbar(msg, 'Cerrar', 'error-snackbar'); 
        }
      },
      error: (paymentError) => {
        this.isLoading = false;
        console.error('❌ Error al procesar el pago con el banco:', paymentError);
        const msg = paymentError?.error?.message || 'Error en la comunicación con el servicio de pago.';
        this.showSnackbar(msg, 'Cerrar', 'error-snackbar'); 
      }
    });
  }

  private showSnackbar(message: string, action: string, panelClass: string = ''): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center', 
      verticalPosition: 'top',    
      panelClass: [panelClass] 
    });
  }
}