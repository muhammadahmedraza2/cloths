import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../../core/services/Cart.Service';
import { CartItemApi } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  private router = inject(Router);

  readonly loaded = signal(false);
  readonly errorMsg = signal('');

  ngOnInit(): void {
    this.cart.loadCart().subscribe({
      next: () => this.loaded.set(true),
      error: () => {
        this.loaded.set(true);
        this.errorMsg.set('Could not load your cart. Please check your connection and try again.');
      },
    });
  }

  updateQty(item: CartItemApi, input: HTMLInputElement): void {
    const qty = input.valueAsNumber;

    // Khali ya galat qty ho to purani value wapas
    if (!Number.isInteger(qty) || qty < 1) {
      input.value = String(item.qty);
      return;
    }
    if (qty === item.qty) return;

    this.errorMsg.set('');
    this.cart.updateQty(item.id, qty).subscribe({
      error: () => {
        input.value = String(item.qty);
        this.errorMsg.set('Could not update the quantity. Please try again.');
      },
    });
  }

  removeItem(itemId: string): void {
    this.errorMsg.set('');
    this.cart.removeItem(itemId).subscribe({
      error: () => this.errorMsg.set('Could not remove the item. Please try again.'),
    });
  }

  proceed(): void {
    if (this.cart.summary().items.length === 0) return;
    this.router.navigate(['/app/checkout']);
  }
}
