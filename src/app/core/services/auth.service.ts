import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { MenuService } from './menu.service';
import { CartService } from './Cart.Service';
import { LoginResponse, RegisterRequest } from '../models/auth.model';

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly menuService = inject(MenuService);
  private readonly cartService = inject(CartService);

  private readonly USER_KEY = 'authUser';

  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      { username, password }
    ).pipe(
      tap(res => {
        this.menuService.clearCache();

        this.tokenService.setToken(
          res.data.token,
          res.data.refreshToken
        );

        const user: AuthUser = {
          username: res.data.username,
          fullName: res.data.fullName,
          role: res.data.role,
          userId: res.data.userId
        };

        localStorage.setItem(
          this.USER_KEY,
          JSON.stringify(user)
        );

        this.currentUser.set(user);
      })
    );
  }

  register(dto: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/register`,
      dto
    );
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(res => {
        this.tokenService.setToken(
          res.data.token,
          res.data.refreshToken
        );

        const user: AuthUser = {
          username: res.data.username,
          fullName: res.data.fullName,
          role: res.data.role,
          userId: res.data.userId
        };

        localStorage.setItem(
          this.USER_KEY,
          JSON.stringify(user)
        );

        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    this.http.post(
      `${environment.apiUrl}/auth/logout`,
      {}
    ).subscribe({
      error: () => undefined
    });

    this.tokenService.clearSession();
    this.menuService.clearCache();
    this.cartService.clear();

    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  isAdmin(): boolean {
    const role = (
      this.currentUser()?.role ??
      this.tokenService.getRole() ??
      ''
    ).toLowerCase();

    return role === 'admin' || role === 'administrator';
  }

  isUser(): boolean {
    return (
      this.currentUser()?.role ??
      this.tokenService.getRole() ??
      ''
    ).toLowerCase() === 'user';
  }

  private readStoredUser(): AuthUser | null {
    if (!this.tokenService.isLoggedIn()) {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }

    try {
      const raw = localStorage.getItem(this.USER_KEY);

      return raw
        ? JSON.parse(raw) as AuthUser
        : null;
    } catch {
      return null;
    }
  }
}