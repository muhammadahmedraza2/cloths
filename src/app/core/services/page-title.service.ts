import { Injectable, signal } from '@angular/core';

/**
 * Header ka title normally route ke `data.title` se aata hai.
 * Master/Setup screens ka title form ke naam (jaise "Product Setup") se aana chahiye,
 * is liye MasterListComponent yahan title set karta hai.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleService {
  readonly override = signal<string | null>(null);

  set(title: string): void {
    this.override.set(title);
  }

  clear(): void {
    this.override.set(null);
  }
}
