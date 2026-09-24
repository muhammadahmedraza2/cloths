import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cart.loadCart().subscribe();
  }

  updateQty(itemId: string, qty: number): void {
    if (qty < 1) return;
    this.cart.updateQty(itemId, qty).subscribe();
  }

  removeItem(itemId: string): void {
    this.cart.removeItem(itemId).subscribe();
  }

  proceed(): void {
    if (this.cart.summary().items.length === 0) return;
    this.router.navigate(['/app/checkout']);
  }
}