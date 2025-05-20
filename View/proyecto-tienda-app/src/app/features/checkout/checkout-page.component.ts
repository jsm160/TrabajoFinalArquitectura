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




@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  userEmail: string = 'desconocido';

  // Campos del formulario de pago
  nombreTitular: string = '';
  numeroTarjeta: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private stockService: StockApiService,
    private providerService: ProviderApiService
  ) { }

  ngOnInit(): void {
    // Cargar items del carrito
    this.cartItems = this.cartService.getCurrentCartItems();
    this.totalPrice = this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // Obtener email del usuario desde el token
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
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.nombreTitular || !this.numeroTarjeta || this.cartItems.length === 0) {
    this.errorMessage = 'Faltan datos de pago o el carrito está vacío.';
    return;
  }

  // Verificar stock para todos los productos
  for (const item of this.cartItems) {
  const { product } = item;
  const productId = product.productId;
  console.log('🧪 Product ID:', productId);

  try {
    const stockResponse = await this.stockService.verifyAvailability(productId, item.quantity).toPromise();

    if (!stockResponse || !stockResponse.available) {
      const restockResponse = await this.providerService.makeRestockOrder(productId, item.quantity, 1).toPromise();

      if (!restockResponse || !restockResponse.success) {
        this.errorMessage = `❌ No hay stock y no se pudo reabastecer el producto "${product.name}".`;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

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


  // Preparar datos del pedido
  const formattedProducts = this.cartItems.map(item => ({
    productId: item.product._id,
    quantity: item.quantity
  }));

  const orderPayload = {
    customerName: this.userEmail,
    products: formattedProducts
  };

  // Enviar pedido al backend
  this.http.post('http://localhost:3004/api/pedidos', orderPayload).subscribe({
    next: () => {
      this.successMessage = '✅ Pedido realizado correctamente.';
      this.cartService.clearCart();
      setTimeout(() => this.router.navigate(['/catalog']), 2500);
    },
    error: (error) => {
      console.error('Error al crear pedido:', error);
      this.errorMessage = error?.error?.message || 'Error al procesar el pedido.';
    }
  });
}


}
