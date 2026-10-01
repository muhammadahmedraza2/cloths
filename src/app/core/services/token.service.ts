import { Injectable } from '@angular/core';

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly tokenKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);

    if (refreshToken) {
      localStorage.setItem(this.refreshKey, refreshToken);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  isLoggedIn(): boolean {

    const payload = this.getPayload();

    if (!payload) {
      return false;
    }

    if (!payload['exp']) {
      return true;
    }

    return payload['exp'] * 1000 > Date.now();
  }

  getRole(): string | null {

    const payload = this.getPayload();

    const role =
      payload?.[ROLE_CLAIM] ??
      payload?.['role'];

    return typeof role === 'string'
      ? role
      : null;
  }

  isAdmin(): boolean {

    const role =
      (this.getRole() ?? '').toLowerCase();

    return (
      role === 'admin' ||
      role === 'administrator'
    );
  }

  private getPayload(): Record<string, any> | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      let base64 = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      while (base64.length % 4 !== 0) {
        base64 += '=';
      }

      return JSON.parse(atob(base64));

    } catch {

      return null;
    }
  }
}