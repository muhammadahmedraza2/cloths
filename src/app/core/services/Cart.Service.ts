import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartResponse, AddToCartRequest, CreateOrderRequest, Order } from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
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
