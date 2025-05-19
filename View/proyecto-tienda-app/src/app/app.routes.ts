import { Routes } from '@angular/router';
import { RegisterPageComponent } from './features/register/register-page.component';
// import { authGuard } from './core/guards/auth.guard'; // Descomenta si implementas guardas

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then(r => r.LOGIN_ROUTES)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./features/catalog/catalog.routes').then(r => r.CATALOG_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then(r => r.CART_ROUTES),
    // canActivate: [authGuard] // Para proteger esta ruta
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(r => r.CHECKOUT_ROUTES),
    // canActivate: [authGuard] // Para proteger esta ruta
  },
  {
    path: 'payment-result',
    loadChildren: () => import('./features/payment-result/payment-result.routes').then(r => r.PAYMENT_RESULT_ROUTES)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./features/pedidos/pedido-page.component').then(m => m.PedidoPageComponent)
  },
  { path: 'register', component: RegisterPageComponent },
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: '**', redirectTo: 'catalog' }
];
