import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { WishItem, WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/Cart.Service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './wishlist.html',
})
export class WishlistComponent implements OnInit {
  wishlist = inject(WishlistService);
  private cart = inject(CartService);

  readonly message = signal('');
  readonly errorMsg = signal('');

  ngOnInit(): void {
    this.wishlist.load();
  }

  moveToCart(item: WishItem): void {
    this.message.set('');
    this.errorMsg.set('');

    this.cart
      .addToCart({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
      })
      .subscribe({
        next: () => {
          this.wishlist.remove(item.productId);
          this.message.set(`${item.name} moved to your cart.`);
        },
        error: () => this.errorMsg.set('Could not add to cart. Please try again.'),
      });
  }

  remove(item: WishItem): void {
    this.wishlist.remove(item.productId);
  }
}
