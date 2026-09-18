import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  paymentMethod: 'cash' | 'bank' = 'cash';
  orderPlaced = false;
  orderNo = '';

  constructor(public cart: CartService, private router: Router) {}

  placeOrder(): void {
    this.orderNo = 'ORD-' + Date.now().toString().slice(-6);
    this.orderPlaced = true;
    this.cart.clearCart();
  }

  backToDashboard(): void {
    this.router.navigate(['/app/dashboard']);
  }
}