import { Injectable, computed, signal } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = 'clothing-erp-notifications';

/**
 * Frontend-level notification store — Admin ke liye.
 * NOTE: Backend abhi tak notifications API deta nahi (yeh zip mein backend included nahi tha),
 * isliye yeh service localStorage use karta hai taake:
 *   - Notification refresh/reload ke baad bhi save rahe
 *   - Same browser ke doosre tab mein bhi (jahan admin login ho) turant dikh jaye ('storage' event)
 * Agar aap alag device/browser pe real-time push chahte hain, backend mein ek Notifications
 * endpoint + SignalR/WebSocket lagana hoga — woh is frontend project ke scope se bahar hai.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private itemsSignal = signal<AppNotification[]>(this.read());
  readonly items = this.itemsSignal.asReadonly();
  readonly unreadCount = computed(() => this.itemsSignal().filter((n) => !n.read).length);

  constructor() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.itemsSignal.set(this.read());
      }
    });
  }

  notifyPaymentReceived(opts: { orderNo: string; amount: number; method: string; status: string }): void {
    const note: AppNotification = {
      id: crypto.randomUUID(),
      title: 'Naya Order / Payment',
      message: `Order ${opts.orderNo} — Rs. ${opts.amount.toLocaleString()} (${opts.method}) — ${opts.status}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [note, ...this.itemsSignal()].slice(0, 50);
    this.itemsSignal.set(updated);
    this.write(updated);
  }

  markAllRead(): void {
    const updated = this.itemsSignal().map((n) => ({ ...n, read: true }));
    this.itemsSignal.set(updated);
    this.write(updated);
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.write([]);
  }

  private read(): AppNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppNotification[]) : [];
    } catch {
      return [];
    }
  }

  private write(items: AppNotification[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
