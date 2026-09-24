import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { MenuService } from './menu.service';
import { LoginData, LoginResponse, RegisterRequest } from '../models/auth.model';

export interface AuthUser { username: string; fullName: string; role: string; userId: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly menuService = inject(MenuService);
  private readonly USER_KEY = 'authUser';
  currentUser = signal<AuthUser | null>(this.readStoredUser());

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
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    this.tokenService.clearSession();
    this.menuService.clearCache();
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  isAdmin(): boolean { return (this.currentUser()?.role ?? '').toLowerCase() === 'admin'; }
  isUser(): boolean { return (this.currentUser()?.role ?? '').toLowerCase() === 'user'; }

  private readStoredUser(): AuthUser | null {
    try { const raw = localStorage.getItem(this.USER_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }
}
