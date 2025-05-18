import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service'; // Ajusta la ruta si es diferente
import { LoginForm } from './login.interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // Para enlaces como "¿Olvidaste tu contraseña?" o "Regístrate"
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
  // No necesitas providers: [AuthService] aquí si está providedIn: 'root'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder); // FormBuilder también se puede inyectar

  private authSubscription!: Subscription;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Añadido minLength como ejemplo
    });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir (esto también podría manejarse con un AuthGuard)
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/catalog']); // O a la página de dashboard/perfil
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    this.errorMessage = null; // Limpiar mensajes de error previos
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
      return;
    }

    this.isLoading = true;
    const loginData: LoginForm = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful', response);
        // La redirección ya se maneja en el ngOnInit al suscribirse a isLoggedIn$
        // o podrías hacerlo explícitamente aquí si lo prefieres:
        // this.router.navigate(['/catalog']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Credenciales incorrectas o error en el servidor.';
        console.error('Error en el login:', error);
        this.loginForm.patchValue({ password: ''}); // Limpiar campo de contraseña por seguridad
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}