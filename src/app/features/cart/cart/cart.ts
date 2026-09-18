import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cart.html',
})
export class CartComponent {
  constructor(public cart: CartService, private router: Router) {}

  proceed(): void {
    if (this.cart.items().length === 0) return;
    this.router.navigate(['/app/checkout']);
  }
}