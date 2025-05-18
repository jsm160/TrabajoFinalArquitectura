// src/app/features/cart/cart.routes.ts
import { Routes } from '@angular/router';
import { CartPageComponent } from './cart-page.component';

export const CART_ROUTES: Routes = [
  {
    path: '', // La ruta base para el feature 'cart' (ej: /cart)
    component: CartPageComponent
  }
  // Aquí podríamos añadir más rutas específicas del carrito si las necesitas,
  // como una página de confirmación de pedido después del checkout.
];