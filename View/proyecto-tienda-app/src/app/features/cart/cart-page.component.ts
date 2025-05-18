// src/app/features/cart/cart-page.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { CartService } from './cart.service'; // Servicio del carrito
import { CartItem } from './cart.interface';   // Interfaz del item del carrito

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;
  isLoggedIn: boolean = false; // Propiedad para rastrear el estado de login

  // Usando inject() para los servicios
  private cartService = inject(CartService);
  private router = inject(Router);

  private subscriptions = new Subscription();

  constructor() {
    this.cartItems$ = this.cartService.cart$;
    this.total$ = this.cartService.getTotal();
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  updateQuantity(productId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 0) {
      if (newQuantity === 0) {
        this.cartService.removeProduct(productId);
      } else {
        this.cartService.updateQuantity(productId, newQuantity);
      }
    } else {
      const currentItem = this.cartService.getCurrentCartItems().find(
        (item: CartItem) => item.product.id === productId
      );
      if (currentItem) {
        inputElement.value = currentItem.quantity.toString();
      }
    }
  }

  removeProduct(productId: number): void {
    this.cartService.removeProduct(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  goToCheckout(): void {
    const currentCartItems = this.cartService.getCurrentCartItems();

    if (currentCartItems.length > 0 && this.isLoggedIn) {
      this.router.navigate(['/checkout']);
    } else if (currentCartItems.length === 0) {
      alert('El carrito está vacío. Agrega productos para realizar el checkout.');
    } else {
      alert('Debes iniciar sesión para realizar el checkout.');
      this.router.navigate(['/login']);
    }
  }

  trackByCartItemId(index: number, item: CartItem): number {
    return item.product.id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}