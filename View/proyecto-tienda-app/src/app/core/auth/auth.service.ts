import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginForm, AuthResponse } from '../../features/login/login.interface'; // Ajusta la ruta a tu interfaz

@Injectable({
  providedIn: 'root' // Servicio singleton
})
export class AuthService {
  private apiUrl = 'YOUR_BACKEND_API_URL/auth'; // <-- CAMBIA ESTO por tu URL real del endpoint de login
  private http = inject(HttpClient);
  private router = inject(Router);

  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInStatus.asObservable();

  private authTokenKey = 'authToken';

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  login(credentials: LoginForm): Observable<AuthResponse> {
    // Simulación de una llamada HTTP. Reemplaza con tu lógica real.
    // return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap(response => {
    //     this.setSession(response);
    //   }),
    //   catchError(this.handleError)
    // );

    // --- INICIO DE SIMULACIÓN (elimina esto cuando tengas tu backend) ---
    return new Observable<AuthResponse>(observer => {
      setTimeout(() => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          const mockResponse: AuthResponse = { token: 'fake-jwt-token-string-12345' };
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error({ status: 401, message: 'Credenciales inválidas' });
        }
      }, 1000);
    }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(this.handleError) // El handleError es genérico
    );
    // --- FIN DE SIMULACIÓN ---
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.authTokenKey, authResult.token);
    this.loggedInStatus.next(true);
    console.log('AuthService: User logged in, token set.');
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this.loggedInStatus.next(false);
    console.log('AuthService: User logged out.');
    this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
      // El cuerpo de la respuesta puede contener pistas sobre qué salió mal
      if (error.status === 401) {
        errorMessage = 'Credenciales incorrectas o no autorizado.';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else {
        errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
      }
    }
    console.error('AuthService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage)); // Devolver un Observable de error
  }
}