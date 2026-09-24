import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartResponse, AddToCartRequest, CreateOrderRequest, Order } from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
<<<<<<< HEAD
  private api = environment.apiUrl;
  private state = signal<CartResponse>({ cartId: '', items: [], totalQuantity: 0, totalAmount: 0 });
  readonly summary = this.state.asReadonly();
  loadCart(): Observable<CartResponse> { return this.http.get<CartResponse>(`${this.api}/cart`).pipe(tap(x => this.state.set(x))); }
  addToCart(dto: AddToCartRequest): Observable<CartResponse> { return this.http.post<CartResponse>(`${this.api}/cart/items`, dto).pipe(tap(x => this.state.set(x))); }
  updateQty(id: string, quantity: number): Observable<CartResponse> { return this.http.put<CartResponse>(`${this.api}/cart/items/${id}`, { quantity }).pipe(tap(x => this.state.set(x))); }
  removeItem(id: string): Observable<CartResponse> { return this.http.delete<CartResponse>(`${this.api}/cart/items/${id}`).pipe(tap(x => this.state.set(x))); }
  clear(): Observable<void> { return this.http.delete<void>(`${this.api}/cart/clear`).pipe(tap(() => this.state.set({ cartId: '', items: [], totalQuantity: 0, totalAmount: 0 }))); }
  checkout(dto: CreateOrderRequest): Observable<Order> { return this.http.post<Order>(`${this.api}/orders`, dto).pipe(tap(() => this.state.set({ cartId: '', items: [], totalQuantity: 0, totalAmount: 0 }))); }
}
=======
  private readonly apiUrl = environment.apiUrl;

  private summarySignal = signal<CartSummaryApi>({ items: [], totalQty: 0, totalAmount: 0 });
  readonly summary = this.summarySignal.asReadonly();

  /** Logout/login par purane user ka cart memory se saaf karta hai. */
  clear(): void {
    this.summarySignal.set({ items: [], totalQty: 0, totalAmount: 0 });
  }

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
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
