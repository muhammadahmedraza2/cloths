import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export interface WishItem {
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
}

/**
 * Wishlist abhi browser (localStorage) mein save hoti hai, har user ki alag.
 * NOTE: Backend mein wishlist API nahi hai. Jab bane to sirf load()/toggle()/remove() ke
 * andar HTTP calls lagani hongi, components mein koi tabdeeli nahi chahiye.
 */
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly auth = inject(AuthService);

  private readonly itemsSignal = signal<WishItem[]>([]);
  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.itemsSignal().length);

  /** Current user ki wishlist load karta hai (page khulte waqt call karo). */
  load(): void {
    this.itemsSignal.set(this.read());
  }

  has(productId: string): boolean {
    return this.itemsSignal().some((i) => i.productId === productId);
  }

  toggle(item: WishItem): void {
    const list = this.has(item.productId)
      ? this.itemsSignal().filter((i) => i.productId !== item.productId)
      : [...this.itemsSignal(), item];
    this.commit(list);
  }

  remove(productId: string): void {
    this.commit(this.itemsSignal().filter((i) => i.productId !== productId));
  }

  private commit(list: WishItem[]): void {
    this.itemsSignal.set(list);
    try {
      localStorage.setItem(this.key(), JSON.stringify(list));
    } catch {
      /* storage full ya band ho to memory mein hi rehne do */
    }
  }

  private key(): string {
    return `wishlist_${this.auth.currentUser()?.username ?? 'guest'}`;
  }

  private read(): WishItem[] {
    try {
      const raw = localStorage.getItem(this.key());
      return raw ? (JSON.parse(raw) as WishItem[]) : [];
    } catch {
      return [];
    }
  }
}
