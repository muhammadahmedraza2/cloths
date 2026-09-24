import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { MenuService } from './menu.service';
<<<<<<< HEAD
import { LoginData, LoginResponse, RegisterRequest } from '../models/auth.model';

export interface AuthUser { username: string; fullName: string; role: string; userId: string; }
=======
import { CartService } from './Cart.Service';

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
}
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly menuService = inject(MenuService);
<<<<<<< HEAD
  private readonly USER_KEY = 'authUser';
  currentUser = signal<AuthUser | null>(this.readStoredUser());
=======
  private readonly cartService = inject(CartService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly USER_KEY = 'authUser';

  /** Header/Dashboard isay this.auth.currentUser() ki tarah use karte hain. */
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        this.menuService.clearCache();
        this.tokenService.setToken(res.data.token, res.data.refreshToken);
        const user = { username: res.data.username, fullName: res.data.fullName, role: res.data.role, userId: res.data.userId };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

<<<<<<< HEAD
  register(dto: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, dto);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        this.tokenService.setToken(res.data.token, res.data.refreshToken);
        const old = this.currentUser();
        const user = { username: res.data.username, fullName: res.data.fullName, role: res.data.role, userId: res.data.userId };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(old ? { ...old, ...user } : user);
=======
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
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    this.tokenService.clearSession();
<<<<<<< HEAD
    this.menuService.clearCache();
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
=======
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.menuService.clearCache();
    this.cartService.clear();
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
  }

  isAdmin(): boolean { return (this.currentUser()?.role ?? '').toLowerCase() === 'admin'; }
  isUser(): boolean { return (this.currentUser()?.role ?? '').toLowerCase() === 'user'; }

<<<<<<< HEAD
  private readStoredUser(): AuthUser | null {
    try { const raw = localStorage.getItem(this.USER_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }
=======
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
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
}
