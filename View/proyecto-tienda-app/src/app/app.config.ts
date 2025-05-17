// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Descomenta si necesitas animaciones

// Importa tus interceptores si los tienes (ej. para tokens)
// import { tokenInterceptor } from './core/interceptors/token.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(), // Permite bindear parámetros de ruta a inputs de componentes
      withPreloading(PreloadAllModules) // Carga perezosa de módulos en segundo plano
    ),
    provideHttpClient(
      // withInterceptors([tokenInterceptor]) // Descomenta y añade tus interceptores
    ),
  ]
};