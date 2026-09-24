import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  Product, Category, Brand, Size, Color, AgeGroup, CartResponse, AddToCartRequest,
  Address, CreateOrderRequest, Order, Payment, Dashboard, UserSummary, Supplier, Invoice, PaymentProof
} from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  products(filters?: { search?: string; categoryId?: string; ageGroupId?: string; sizeId?: string; colorId?: string }): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(filters ?? {}).forEach(([k, v]) => { if (v) params = params.set(k, v); });
    return this.http.get<Product[]>(`${this.base}/catalog/products`, { params });
  }
  product(id: string): Observable<Product> { return this.http.get<Product>(`${this.base}/catalog/products/${id}`); }
  categories(): Observable<Category[]> { return this.http.get<Category[]>(`${this.base}/catalog/categories`); }
  brands(): Observable<Brand[]> { return this.http.get<Brand[]>(`${this.base}/catalog/brands`); }
  sizes(): Observable<Size[]> { return this.http.get<Size[]>(`${this.base}/catalog/sizes`); }
  colors(): Observable<Color[]> { return this.http.get<Color[]>(`${this.base}/catalog/colors`); }
  ageGroups(): Observable<AgeGroup[]> { return this.http.get<AgeGroup[]>(`${this.base}/catalog/age-groups`); }

  cart(): Observable<CartResponse> { return this.http.get<CartResponse>(`${this.base}/cart`); }
  addCart(dto: AddToCartRequest): Observable<CartResponse> { return this.http.post<CartResponse>(`${this.base}/cart/items`, dto); }
  updateCart(id: string, quantity: number): Observable<CartResponse> { return this.http.put<CartResponse>(`${this.base}/cart/items/${id}`, { quantity }); }
  removeCart(id: string): Observable<CartResponse> { return this.http.delete<CartResponse>(`${this.base}/cart/items/${id}`); }
  clearCart(): Observable<void> { return this.http.delete<void>(`${this.base}/cart/clear`); }

  addresses(): Observable<Address[]> { return this.http.get<Address[]>(`${this.base}/addresses`); }
  addAddress(dto: Omit<Address, 'id'|'userId'>): Observable<Address> { return this.http.post<Address>(`${this.base}/addresses`, dto); }
  deleteAddress(id: string): Observable<void> { return this.http.delete<void>(`${this.base}/addresses/${id}`); }

  checkout(dto: CreateOrderRequest): Observable<Order> { return this.http.post<Order>(`${this.base}/orders`, dto); }
  myOrders(): Observable<Order[]> { return this.http.get<Order[]>(`${this.base}/orders`); }
  order(id: string): Observable<Order> { return this.http.get<Order>(`${this.base}/orders/${id}`); }
  invoice(orderId: string): Observable<Invoice> { return this.http.get<Invoice>(`${this.base}/invoices/${orderId}`); }
  invoicePrint(orderId: string): Observable<string> { return this.http.get(`${this.base}/invoices/${orderId}/print`, { responseType: 'text' }); }

  uploadProof(file: File): Observable<any> {
    const form = new FormData(); form.append('file', file);
    return this.http.post<PaymentProof>(`${this.base}/payment-proof/upload`, form);
  }

  adminDashboard(): Observable<Dashboard> { return this.http.get<Dashboard>(`${this.base}/admin/dashboard`); }
  adminUsers(): Observable<UserSummary[]> { return this.http.get<UserSummary[]>(`${this.base}/admin/users`); }
  setUserActive(id: string, value: boolean): Observable<any> {
    return this.http.patch(`${this.base}/admin/users/${id}/active?value=${value}`, {});
  }
  adminOrders(): Observable<Order[]> { return this.http.get<Order[]>(`${this.base}/admin/orders`); }
  updateOrderStatus(id: string, status: number): Observable<any> { return this.http.patch(`${this.base}/admin/orders/${id}/status`, { status }); }
  payments(): Observable<Payment[]> { return this.http.get<Payment[]>(`${this.base}/admin/payments`); }
  updatePaymentStatus(id: string, status: number): Observable<any> { return this.http.patch(`${this.base}/admin/payments/${id}/status`, { status }); }

  saveProduct(dto: any, id?: string): Observable<Product> {
    return id ? this.http.put<Product>(`${this.base}/admin/products/${id}`, dto) : this.http.post<Product>(`${this.base}/admin/products`, dto);
  }
  deleteProduct(id: string): Observable<any> { return this.http.delete(`${this.base}/admin/products/${id}`); }
  saveCategory(dto: any, id?: string): Observable<any> {
    return id ? this.http.put(`${this.base}/admin/categories/${id}`, dto) : this.http.post(`${this.base}/admin/categories`, dto);
  }
  saveBrand(dto: any, id?: string): Observable<any> {
    return id ? this.http.put(`${this.base}/admin/brands/${id}`, dto) : this.http.post(`${this.base}/admin/brands`, dto);
  }
  saveSize(dto: any, id?: string): Observable<any> {
    return id ? this.http.put(`${this.base}/admin/sizes/${id}`, dto) : this.http.post(`${this.base}/admin/sizes`, dto);
  }
  saveColor(dto: any, id?: string): Observable<any> {
    return id ? this.http.put(`${this.base}/admin/colors/${id}`, dto) : this.http.post(`${this.base}/admin/colors`, dto);
  }
  saveAgeGroup(dto: any, id?: string): Observable<any> {
    return id ? this.http.put(`${this.base}/admin/age-groups/${id}`, dto) : this.http.post(`${this.base}/admin/age-groups`, dto);
  }
  suppliers(): Observable<Supplier[]> { return this.http.get<Supplier[]>(`${this.base}/admin/suppliers`); }
  saveSupplier(dto: any, id?: string): Observable<Supplier> {
    return id ? this.http.put<Supplier>(`${this.base}/admin/suppliers/${id}`, dto) : this.http.post<Supplier>(`${this.base}/admin/suppliers`, dto);
  }
  createPurchase(dto: any): Observable<any> { return this.http.post(`${this.base}/admin/purchases`, dto); }
}
