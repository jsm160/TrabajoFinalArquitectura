import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../catalog.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() realStock: number | undefined;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  hasStock(): boolean {
    return this.realStock !== undefined && this.realStock > 0;
  }

  isLowStock(): boolean {
    return this.realStock !== undefined && this.realStock <= 5 && this.realStock > 0;
  }
}
