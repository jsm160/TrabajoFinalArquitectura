import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, BehaviorSubject, map, startWith } from 'rxjs';
import { Product } from './catalog.interface';
import { CatalogService } from './catalog.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { CartService } from '../cart/cart.service';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { StockApiService } from '../../services-integration/soap/services/stock-api.service'; // ✅ Asegúrate de importar

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FormsModule
  ],
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css']
})
export class CatalogPageComponent implements OnInit {
  allProducts$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  isLoading = true;

  productStock: Record<number, number> = {}; // ✅ Nuevo: stock real por productId

  search$ = new BehaviorSubject<string>('');
  category$ = new BehaviorSubject<string>('all');
  maxPrice$ = new BehaviorSubject<number | null>(null);

  categories: string[] = [];

  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private stockService = inject(StockApiService); // ✅ Nuevo servicio

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.allProducts$ = this.catalogService.getProducts().pipe(
      startWith([]),
      map(products => {
        this.categories = [...new Set(products.map(p => p.category).filter((c): c is string => typeof c === 'string'))];

        // ✅ Cargar stock real desde backend para cada producto
        for (const product of products) {
          if (product.productId !== undefined) {
            this.stockService.getStock(product.productId).subscribe({
              next: (res) => {
                console.log(`📦 Stock recibido para ID ${product.productId}:`, res.stock);
                this.productStock[product.productId] = res.stock;
              },
              error: (err) => {
                console.warn(`❌ Error al obtener stock para ID ${product.productId}`, err);
                this.productStock[product.productId] = 0;
              }
            });

          }
        }

        return products;
      })
    );

    this.filteredProducts$ = combineLatest([
      this.allProducts$,
      this.search$,
      this.category$,
      this.maxPrice$
    ]).pipe(
      map(([products, search, category, maxPrice]) => {
        return products.filter(product =>
          (!search || product.name.toLowerCase().includes(search.toLowerCase())) &&
          (category === 'all' || product.category === category) &&
          (!maxPrice || product.price <= maxPrice)
        );
      })
    );

    this.allProducts$.subscribe(() => (this.isLoading = false));
  }

  onAddToCart(product: Product): void {
    this.cartService.addProduct(product);
    alert(`${product.name} añadido al carrito.`);
  }

  trackByProductId(index: number, product: Product): string {
    return product._id;
  }

  onSearchChange(value: string): void {
    this.search$.next(value);
  }

  onCategoryChange(value: string): void {
    this.category$.next(value);
  }

  onMaxPriceChange(value: number | null): void {
    this.maxPrice$.next(value);
  }

  handleSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onSearchChange(input.value);
  }

  handleCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.onCategoryChange(select.value);
  }

  handleMaxPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.onMaxPriceChange(value ? Number(value) : null);
  }






}
