import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginForm, AuthResponse } from '../../features/login/login.interface';
import { environment } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiAuth;
  private http = inject(HttpClient);
  private router = inject(Router);
  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInStatus.asObservable();

  private authTokenKey = 'authToken';

  constructor() {
     window.addEventListener('beforeunload', () => {
      this.logout(); 
    });
   }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  login(credentials: LoginForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(this.handleError)
    );
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
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  register(data: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3003/api/auth/register', data);
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Credenciales incorrectas o no autorizado.';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else {
        errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
      }
    }
    console.error('AuthService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}

