import { Injectable } from '@angular/core';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly tokenKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';
  setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) localStorage.setItem(this.refreshKey, refreshToken);
  }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getRefreshToken(): string | null { return localStorage.getItem(this.refreshKey); }
  clearSession(): void { localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.refreshKey); }
  isLoggedIn(): boolean {
    const payload = this.getPayload();
    return !!payload && (!payload['exp'] || payload['exp'] * 1000 > Date.now());
  }
  getRole(): string | null {
    const p = this.getPayload(); const role = p?.[ROLE_CLAIM] ?? p?.['role'];
    return typeof role === 'string' ? role : null;
  }
  isAdmin(): boolean { return (this.getRole() ?? '').toLowerCase() === 'admin'; }
  private getPayload(): Record<string, any> | null {
    const token = this.getToken(); if (!token) return null;
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64));
    } catch { return null; }
  }
}
