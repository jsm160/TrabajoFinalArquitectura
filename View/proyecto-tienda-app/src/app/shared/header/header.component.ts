import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartService } from '../../features/cart/cart.service'; 
import { AuthService } from '../../core/auth/auth.service';   

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Inyección de servicios
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  cartItemCount$: Observable<number>;
  isLoggedIn$: Observable<boolean>;

  private subscriptions = new Subscription();

  constructor() {
    // Inicialización de los observables
    this.cartItemCount$ = this.cartService.getTotalItemCount();
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
  }

  // Método para realizar el logout
  logout(): void {
    this.authService.logout();
    // El AuthService se encarga de redirigir a /login después del logout.
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}