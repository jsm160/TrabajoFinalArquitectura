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
    localStorage.removeItem(this.localStorageKey);
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

  /**
   * Guarda el estado actual del carrito en localStorage.
   * @param items Los ítems del carrito a guardar.
   */
  private saveCartToLocalStorage(items: CartItem[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
    console.log('CartService: Cart saved to localStorage.');
  }

  /**
   * Método centralizado para actualizar el BehaviorSubject y persistir en localStorage.
   * @param items El nuevo array de ítems del carrito.
   */
  private updateCartState(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToLocalStorage(items);

  }

  /**
   * Añade un producto al carrito.
   * Si el producto ya existe, incrementa su cantidad.
   * @param productToAdd El producto a añadir.
   * @param quantityToAdd La cantidad a añadir (por defecto 1).
   */
  addProduct(productToAdd: Product, quantityToAdd: number = 1): void {
    if (quantityToAdd <= 0) {
      console.warn('CartService: Attempted to add product with zero or negative quantity.', productToAdd.name);
      return;
    }

    const currentItems = this.cartItemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === productToAdd.id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // El producto ya está en el carrito, actualiza la cantidad
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
      console.log(`CartService: Increased quantity for ${productToAdd.name} by ${quantityToAdd}. New quantity: ${updatedItems[existingItemIndex].quantity}`);
    } else {
      // El producto es nuevo en el carrito
      updatedItems = [...currentItems, { product: productToAdd, quantity: quantityToAdd }];
      console.log(`CartService: Added new product ${productToAdd.name} with quantity ${quantityToAdd}.`);
    }
    this.updateCartState(updatedItems);
  }

  /**
   * Actualiza la cantidad de un producto específico en el carrito.
   * Si la nueva cantidad es 0 o menos, el producto se elimina del carrito.
   * @param productId El ID del producto a actualizar.
   * @param newQuantity La nueva cantidad.
   */
  updateQuantity(productId: number, newQuantity: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    let updatedItems: CartItem[];

    if (newQuantity <= 0) {
      // Si la nueva cantidad es 0 o negativa, eliminamos el producto
      updatedItems = currentItems.filter(item => item.product.id !== productId);
      console.log(`CartService: Removed product ID ${productId} due to quantity update to ${newQuantity}.`);
    } else {
      updatedItems = currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
      const updatedItem = updatedItems.find(item => item.product.id === productId);
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
   * @param productId El ID del producto a eliminar.
   */
  removeProduct(productId: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    const productToRemove = currentItems.find(item => item.product.id === productId);
    const updatedItems = currentItems.filter(item => item.product.id !== productId);

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
   * Calcula el valor monetario total de todos los ítems en el carrito.
   * @returns Un Observable que emite el total del carrito.
   */
  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))
    );
  }

  /**
   * Obtiene el número total de ítems individuales en el carrito (suma de todas las cantidades).
   * Útil para mostrar un contador en un ícono de carrito, por ejemplo.
   * @returns Un Observable que emite la cuenta total de ítems.
   */
  getTotalItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  /**
   * Obtiene una instantánea del estado actual de los ítems del carrito.
   * Úsalo con precaución, prefiere suscribirte a `cart$` para reactividad.
   * @returns Un array con los ítems actuales del carrito.
   */
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
} 