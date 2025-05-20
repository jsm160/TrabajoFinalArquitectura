import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.interface';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { ProviderApiService } from '../../services-integration/soap/services/provider-api.service';
import { StockApiService } from '../../services-integration/soap/services/stock-api.service';

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
  mensaje: string | undefined;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar ,
     private stockService: StockApiService,
    private providerService: ProviderApiService

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

  async confirmPurchase(): Promise<void> {
   
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

    for (const item of this.cartItems) {
      const { product } = item;
      const productId = product.productId;
      console.log('🧪 Product ID:', productId);

      try {

        console.log('Product Ctd:', item.quantity);
        const stockResponse = await this.stockService.verifyAvailability(productId, item.quantity).toPromise();
      console.log('stockResponse:', stockResponse);
        if (!stockResponse || !stockResponse.available) {
          const restockResponse = await this.providerService.makeRestockOrder(productId, item.quantity, 2).toPromise();
        

          if (!restockResponse || !restockResponse.success) {
            this.errorMessage = `❌ No hay stock y no se pudo reabastecer el producto "${product.name}".`;
            return;
          }
          this.showSnackbar('No hay stock, reabasteciendo...', 'Cerrar', 'success-snackbar');

          await new Promise(resolve => setTimeout(resolve, 2000));
          this.showSnackbar('Producto reabastecido.', 'Cerrar', 'success-snackbar');
          const newCheck = await this.stockService.verifyAvailability(productId, item.quantity).toPromise();

          if (!newCheck || !newCheck.available) {
            this.errorMessage = `❌ El proveedor aceptó, pero aún no hay stock de "${product.name}".`;
            return;
          }
        }

        // ✅ Aquí restas el stock en MySQL (vía SOAP)
        await this.stockService.decreaseStock(productId, item.quantity).toPromise();
        console.log(`✅ Stock actualizado para "${product.name}"`);

      } catch (err) {
        console.error(`Error al verificar o reabastecer "${product.name}":`, err);
        this.errorMessage = `Error técnico con el producto "${product.name}".`;
        return;
      }
    }

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