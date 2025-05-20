import { Routes } from '@angular/router';
import { RegisterPageComponent } from './features/register/register-page.component';

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
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(r => r.CHECKOUT_ROUTES),
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./features/pedidos/pedido-page.component').then(m => m.PedidoPageComponent)
  },
  { path: 'register', component: RegisterPageComponent },
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: '**', redirectTo: 'catalog' }
];
