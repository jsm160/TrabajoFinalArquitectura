// src/app/features/cart/cart.interface.ts
import { Product } from '../catalog/catalog.interface'; // Importamos la interfaz Product

export interface CartItem {
  product: Product;
  quantity: number;
}