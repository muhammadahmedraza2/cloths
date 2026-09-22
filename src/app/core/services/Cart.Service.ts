import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddToCartRequest, CartSummaryApi, CheckoutRequest, CheckoutResponse } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private summarySignal = signal<CartSummaryApi>({ items: [], totalQty: 0, totalAmount: 0 });
  readonly summary = this.summarySignal.asReadonly();

  loadCart(): Observable<CartSummaryApi> {
    return this.http.get<CartSummaryApi>(`${this.apiUrl}/cart`).pipe(
      tap((summary) => this.summarySignal.set(summary))
    );
  }

  addToCart(dto: AddToCartRequest): Observable<CartSummaryApi> {
    return this.http.post<CartSummaryApi>(`${this.apiUrl}/cart/items`, dto).pipe(
      tap((summary) => this.summarySignal.set(summary))
    );
  }

  updateQty(itemId: string, qty: number): Observable<CartSummaryApi> {
    return this.http.put<CartSummaryApi>(`${this.apiUrl}/cart/items/${itemId}`, { qty }).pipe(
      tap((summary) => this.summarySignal.set(summary))
    );
  }

  removeItem(itemId: string): Observable<CartSummaryApi> {
    return this.http.delete<CartSummaryApi>(`${this.apiUrl}/cart/items/${itemId}`).pipe(
      tap((summary) => this.summarySignal.set(summary))
    );
  }

  checkout(dto: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, dto).pipe(
      tap(() => this.summarySignal.set({ items: [], totalQty: 0, totalAmount: 0 }))
    );
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/checkout/orders`);
  }
}