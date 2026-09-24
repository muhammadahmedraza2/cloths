import { Injectable } from '@angular/core';

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly tokenKey = 'accessToken';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Token maujood hai aur expire nahi hua
  isLoggedIn(): boolean {
    const payload = this.getPayload();
    if (!payload) {
      return false;
    }
    // exp seconds mein hota hai
    if (payload['exp'] && payload['exp'] * 1000 < Date.now()) {
      return false;
    }
    return true;
  }

  // Token ke andar se role padhta hai
  getRole(): string | null {
    const payload = this.getPayload();
    const role = payload?.[ROLE_CLAIM] ?? payload?.['role'];
    return typeof role === 'string' ? role : null;
  }

  isAdmin(): boolean {
    const role = this.getRole()?.toLowerCase();
    return role === 'administrator' || role === 'admin';
  }

  private getPayload(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}