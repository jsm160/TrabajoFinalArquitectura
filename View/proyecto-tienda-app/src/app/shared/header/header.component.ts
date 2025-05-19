import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartService } from '../../features/cart/cart.service';
import { AuthService } from '../../core/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount$: Observable<number>;
  isLoggedIn$: Observable<boolean>;
  userEmail: string | null = null;
  showDropdown = false;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private subscriptions = new Subscription();

  constructor() {
    this.cartItemCount$ = this.cartService.getTotalItemCount();
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userEmail = decoded.email || 'Usuario';
      } catch (e) {
        this.userEmail = 'Usuario';
      }
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
