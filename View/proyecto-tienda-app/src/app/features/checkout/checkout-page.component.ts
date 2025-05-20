import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.interface';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { ProviderApiService } from '../../services-integration/soap/services/provider-api.service';
import { StockApiService } from '../../services-integration/soap/services/stock-api.service';
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
  errorMessage: string | undefined;
  successMessage: string | undefined;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private stockService: StockApiService,
    private providerService: ProviderApiService,
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
  this.errorMessage = '';
  this.successMessage = '';

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
    next: async (paymentResponse: any) => {
      if (!paymentResponse.success) {
        this.isLoading = false;
        this.showSnackbar(paymentResponse.message || 'El pago fue rechazado por el banco.', 'Cerrar', 'error-snackbar');
        return;
      }

      console.log('✅ Pago aprobado, verificando stock y haciendo pedido...');

      try {
        // Verificación y actualización de stock
        for (const item of this.cartItems) {
          const { product } = item;
          const productId = product.productId;
          console.log('🧪 Verificando producto:', product.name, `ID: ${productId}`);

          const stockResponse = await this.stockService.verifyAvailability(productId, item.quantity).toPromise();

          if (!stockResponse || !stockResponse.available) {
            const restockResponse = await this.providerService.makeRestockOrder(productId, item.quantity, 1).toPromise();

            if (!restockResponse || !restockResponse.success) {
              this.isLoading = false;
              this.showSnackbar(`❌ No hay stock y no se pudo reabastecer el producto "${product.name}".`, 'Cerrar', 'error-snackbar');
              return;
            }

            await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2s

            const newCheck = await this.stockService.verifyAvailability(productId, item.quantity).toPromise();
            if (!newCheck || !newCheck.available) {
              this.isLoading = false;
              this.showSnackbar(`❌ El proveedor aceptó, pero aún no hay stock de "${product.name}".`, 'Cerrar', 'error-snackbar');
              return;
            }
          }

          // ✅ Restar stock
          await this.stockService.decreaseStock(productId, item.quantity).toPromise();
        }

        // Crear pedido
        const formattedProducts = this.cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));

        const orderPayload = {
          customerName: this.userEmail,
          products: formattedProducts,
          totalPrice: this.totalPrice
        };

        console.log('📦 Enviando pedido al backend:', orderPayload);

        this.http.post('http://localhost:3004/api/pedidos', orderPayload).subscribe({
          next: () => {
            this.cartService.clearCart();
            this.showSnackbar('Pedido y pago procesados correctamente.', 'Cerrar', 'success-snackbar');
            this.isLoading = false;
            setTimeout(() => this.router.navigate(['/catalog']), 2500);
          },
          error: (orderError) => {
            console.error('❌ Error al crear pedido:', orderError);
            this.showSnackbar(orderError?.error?.message || 'Error al crear el pedido.', 'Cerrar', 'error-snackbar');
            this.isLoading = false;
          }
        });

      } catch (err) {
        console.error('❌ Error en proceso de stock/pedido:', err);
        this.showSnackbar('Error durante la validación o reabastecimiento del stock.', 'Cerrar', 'error-snackbar');
        this.isLoading = false;
      }
    },
    error: (paymentError) => {
      console.error('❌ Error al contactar con el banco:', paymentError);
      this.showSnackbar(paymentError?.error?.message || 'Error al procesar el pago.', 'Cerrar', 'error-snackbar');
      this.isLoading = false;
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