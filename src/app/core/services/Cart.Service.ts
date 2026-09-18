import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  qty: number;
}

const STORAGE_KEY = 'clothing-erp-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSignal = signal<CartItem[]>(this.readStored());
  readonly items = this.itemsSignal.asReadonly();

  readonly totalQty = computed(() =>
    this.itemsSignal().reduce((sum, i) => sum + i.qty, 0)
  );

  readonly totalAmount = computed(() =>
    this.itemsSignal().reduce((sum, i) => sum + i.qty * i.price, 0)
  );

  private readStored(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
  }

  addToCart(item: Omit<CartItem, 'qty'>, qty = 1): void {
    const list = [...this.itemsSignal()];
    const existing = list.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      list.push({ ...item, qty });
    }
    this.itemsSignal.set(list);
    this.save();
  }

  updateQty(id: string, qty: number): void {
    const list = this.itemsSignal().map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, qty) } : i
    );
    this.itemsSignal.set(list);
    this.save();
  }

  removeItem(id: string): void {
    this.itemsSignal.set(this.itemsSignal().filter((i) => i.id !== id));
    this.save();
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.save();
  }
}