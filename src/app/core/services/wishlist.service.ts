import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export interface WishItem {
  productId: string;
  productVariantId: string;
  name: string;
  imageUrl?: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly auth = inject(AuthService);

  private readonly itemsSignal = signal<WishItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.itemsSignal().length);

  load(): void {
    this.itemsSignal.set(this.read());
  }

  has(productId: string): boolean {
    return this.itemsSignal().some(
      item => item.productId === productId
    );
  }

  toggle(item: WishItem): void {
    const list = this.has(item.productId)
      ? this.itemsSignal().filter(
          item => item.productId !== item.productId
        )
      : [...this.itemsSignal(), item];

    this.commit(list);
  }

  remove(productId: string): void {
    this.commit(
      this.itemsSignal().filter(
        item => item.productId !== productId
      )
    );
  }

  private commit(list: WishItem[]): void {
    this.itemsSignal.set(list);

    try {
      localStorage.setItem(
        this.key(),
        JSON.stringify(list)
      );
    } catch {
    }
  }

  private key(): string {
    return `wishlist_${this.auth.currentUser()?.username ?? 'guest'}`;
  }

  private read(): WishItem[] {
    try {
      const raw = localStorage.getItem(this.key());

      if (!raw) {
        return [];
      }

      return JSON.parse(raw) as WishItem[];
    } catch {
      return [];
    }
  }
}