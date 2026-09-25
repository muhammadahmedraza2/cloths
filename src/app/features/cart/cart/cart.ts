import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartItem } from '../../../core/models/shop.model';
import { CartService } from '../../../core/services/Cart.Service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly loaded = signal(false);
  readonly errorMsg = signal('');

  ngOnInit(): void {
    this.cart.loadCart().subscribe({
      next: () => this.loaded.set(true),
      error: () => {
        this.loaded.set(true);
        this.errorMsg.set('Could not load your cart. Please check your connection and try again.');
      }
    });
  }

  updateQty(item: CartItem, input: HTMLInputElement): void {
    const qty = input.valueAsNumber;

    if (!Number.isInteger(qty) || qty < 1) {
      input.value = String(item.quantity);
      return;
    }

    if (qty === item.quantity) return;

    this.errorMsg.set('');
    this.cart.updateQty(item.id, qty).subscribe({
      error: () => {
        input.value = String(item.quantity);
        this.errorMsg.set('Could not update the quantity. Please try again.');
      }
    });
  }

  removeItem(id: string): void {
    this.errorMsg.set('');
    this.cart.removeItem(id).subscribe({
      error: () => this.errorMsg.set('Could not remove the item. Please try again.')
    });
  }

  proceed(): void {
    if (this.cart.summary().items.length) {
      this.router.navigate(['/app/checkout']);
    }
  }
}