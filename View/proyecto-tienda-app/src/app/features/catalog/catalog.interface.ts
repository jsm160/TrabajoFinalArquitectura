// src/app/features/catalog/catalog.interface.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock?: number;
    category?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
  }