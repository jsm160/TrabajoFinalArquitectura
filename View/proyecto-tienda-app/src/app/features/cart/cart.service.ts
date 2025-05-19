import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../catalog/catalog.interface';
import { CartItem } from './cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cart$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private readonly localStorageKey = 'shoppingCart';

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem(this.localStorageKey);
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        this.cartItemsSubject.next(parsedCart);
        console.log('CartService: Cart loaded from localStorage.', parsedCart);
      } catch (e) {
        console.error('CartService: Error parsing cart from localStorage. Clearing stored cart.', e);
        localStorage.removeItem(this.localStorageKey);
      }
    }
  }

  private saveCartToLocalStorage(items: CartItem[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
    console.log('CartService: Cart saved to localStorage.');
  }

  private updateCartState(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToLocalStorage(items);
  }

  /**
   * Añade un producto al carrito.
   */
  addProduct(productToAdd: Product, quantityToAdd: number = 1): void {
    if (quantityToAdd <= 0) {
      console.warn('CartService: Attempted to add product with zero or negative quantity.', productToAdd.name);
      return;
    }

    const currentItems = this.cartItemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product._id === productToAdd._id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
      console.log(`CartService: Increased quantity for ${productToAdd.name} by ${quantityToAdd}.`);
    } else {
      updatedItems = [...currentItems, { product: productToAdd, quantity: quantityToAdd }];
      console.log(`CartService: Added new product ${productToAdd.name} with quantity ${quantityToAdd}.`);
    }

    this.updateCartState(updatedItems);
  }

  /**
   * Actualiza la cantidad de un producto específico en el carrito.
   */
  updateQuantity(productId: string, newQuantity: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    let updatedItems: CartItem[];

    if (newQuantity <= 0) {
      updatedItems = currentItems.filter(item => item.product._id !== productId);
      console.log(`CartService: Removed product ID ${productId} due to quantity update to ${newQuantity}.`);
    } else {
      updatedItems = currentItems.map(item =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      );
      const updatedItem = updatedItems.find(item => item.product._id === productId);
      if (updatedItem) {
        console.log(`CartService: Updated quantity for product ID ${productId} to ${newQuantity}.`);
      } else {
        console.warn(`CartService: Product ID ${productId} not found during quantity update.`);
      }
    }

    this.updateCartState(updatedItems);
  }

  /**
   * Elimina un producto del carrito.
   */
  removeProduct(productId: string): void {
    const currentItems = this.cartItemsSubject.getValue();
    const productToRemove = currentItems.find(item => item.product._id === productId);
    const updatedItems = currentItems.filter(item => item.product._id !== productId);

    if (productToRemove) {
      console.log(`CartService: Removed product ${productToRemove.product.name} (ID: ${productId}) from cart.`);
    } else {
      console.warn(`CartService: Attempted to remove product ID ${productId}, but it was not found in cart.`);
    }

    this.updateCartState(updatedItems);
  }

  /**
   * Vacía completamente el carrito.
   */
  clearCart(): void {
    this.updateCartState([]);
    console.log('CartService: Cart cleared.');
  }

  /**
   * Devuelve el total en precio del carrito.
   */
  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))
    );
  }

  /**
   * Devuelve el número total de ítems (suma de cantidades).
   */
  getTotalItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  /**
   * Snapshot del estado actual del carrito.
   */
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
}
