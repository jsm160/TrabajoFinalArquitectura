import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Product } from './catalog.interface'; 
import { CatalogService } from './catalog.service'; 
import { ProductCardComponent } from './product-card/product-card.component'; 
import { CartService } from '../cart/cart.service'; 

@Component({
  selector: 'app-catalog-page',
  standalone: true, 
  imports: [
    CommonModule,
    ProductCardComponent, 
  ],
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css'] 
})
export class CatalogPageComponent implements OnInit {
  products$!: Observable<Product[]>;
  isLoading: boolean = true;

  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.products$ = this.catalogService.getProducts();
    this.products$.subscribe({
      next: () => this.isLoading = false, 
      error: () => this.isLoading = false, 
     
    });
  }

  onAddToCart(product: Product): void {
    console.log('Añadiendo al carrito desde catálogo:', product.name);
    this.cartService.addProduct(product);
    
    alert(`${product.name} añadido al carrito.`);
  }

  // Para el *ngFor, para mejorar el rendimiento
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}