import { ApplicationConfig} from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient} from '@angular/common/http';
import { routes } from './app.routes';

export const environment = {
  production: false,
  apiAuth: 'http://localhost:3003/api/auth',
  apiCatalogo: 'http://localhost:3002/api/products',
  apiBanco: 'http://localhost:3001/api/banco',
  apiPedidos: 'http://localhost:3004/api/pedidos',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(
    ),
  ]
};