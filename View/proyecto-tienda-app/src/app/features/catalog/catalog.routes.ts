// src/app/features/catalog/catalog.routes.ts
import { Routes } from '@angular/router';
import { CatalogPageComponent } from './catalog-page.component';
// import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component'; // Si crea una pagina de detalle

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    component: CatalogPageComponent
  },
  // {
  //   path: ':id', // Asume que :id es un número para el producto
  //   component: ProductDetailPageComponent // Necesitarías crear este componente
  // }
];