import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {
  AddToCartApiRequest,
  CartResponse,
  CreateOrderRequest,
  Order
} from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  private readonly state = signal<CartResponse>({
    cartId: '',
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  });

  readonly summary = this.state.asReadonly();

  loadCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.api}/cart`).pipe(
      tap(response => this.state.set(response))
    );
  }

  addToCart(dto: AddToCartApiRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(
      `${this.api}/cart/items`,
      dto
    ).pipe(
      tap(response => this.state.set(response))
    );
  }

  updateQty(id: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(
      `${this.api}/cart/items/${id}`,
      { quantity }
    ).pipe(
      tap(response => this.state.set(response))
    );
  }

  removeItem(id: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(
      `${this.api}/cart/items/${id}`
    ).pipe(
      tap(response => this.state.set(response))
    );
  }

  clear(): Observable<void> {
    return this.http.delete<void>(`${this.api}/cart/clear`).pipe(
      tap(() => this.state.set({
        cartId: '',
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      }))
    );
  }

  checkout(dto: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(
      `${this.api}/orders`,
      dto
    ).pipe(
      tap(() => this.state.set({
        cartId: '',
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      }))
    );
  }
}