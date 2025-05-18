// src/app/features/catalog/catalog.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from './catalog.interface'; 

import { CatalogApiService } from '../../services-integration/rest/catalog-api.service';
import { StockApiService } from '../../services-integration/soap/stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private catalogApiService = inject(CatalogApiService);
  private stockApiService = inject(StockApiService);

  private mockProducts: Product[] = [
    { id: 1, name: 'Camiseta Angular', description: 'Ideal para devs, 100% algodón', price: 22.95, imageUrl: 'assets/images/camiseta_angular.png', category: 'Ropa', stock: 10 },
    { id: 2, name: 'Taza Standalone', description: 'Para tu café mañanero mientras codificas', price: 12.50, imageUrl: 'assets/images/taza_standalone.png', category: 'Hogar', stock: 5 },
    { id: 3, name: 'Gorra TypeScript', description: 'Protección con tipado fuerte', price: 18.00, imageUrl: 'assets/images/gorra_ts.png', category: 'Accesorios', stock: 0 },
    { id: 4, name: 'Pegatinas Dev', description: 'Decora tu laptop con estilo', price: 5.00, imageUrl: 'assets/images/pegatinas_dev.png', category: 'Accesorios', stock: 25 },
  ];

  getProducts(): Observable<Product[]> {
    // Usaremos mocks por ahora para simplificar, aqui cambiamos a la lógica de API cuando esté lista
    console.log('CatalogService: Usando productos mockeados');
    return of(this.mockProducts).pipe(
    );
    // return this.catalogApiService.fetchProducts().pipe(catchError(this.handleError<Product[]>('getProducts', [])));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
    // return this.catalogApiService.fetchProductById(id).pipe(catchError(this.handleError<Product | undefined>('getProductById', undefined)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);
      return of(result as T);
    };
  }
}