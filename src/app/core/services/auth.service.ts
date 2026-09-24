import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { TokenService } from './token.service';
import { MenuService } from './menu.service';
import { CartService } from './Cart.Service';

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly menuService = inject(MenuService);
  private readonly cartService = inject(CartService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly USER_KEY = 'authUser';

  /** Header/Dashboard isay this.auth.currentUser() ki tarah use karte hain. */
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  login(username: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        // Pichle user ka menu/cart memory se saaf karo
        this.menuService.clearCache();
        this.cartService.clear();

        this.tokenService.setToken(res.token);

        const user: AuthUser = {
          username: res.username,
          fullName: res.fullName,
          role: res.role,
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    this.tokenService.clearSession();
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.menuService.clearCache();
    this.cartService.clear();
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  isAdmin(): boolean {
    const role = (this.currentUser()?.role ?? this.tokenService.getRole() ?? '').toLowerCase();
    return role === 'administrator' || role === 'admin';
  }

  private readStoredUser(): AuthUser | null {
    // Token expire ya missing ho to purana user data bhi hata do
    if (!this.tokenService.isLoggedIn()) {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
