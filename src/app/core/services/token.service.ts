import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'clothing-erp-token';
const USER_KEY = 'clothing-erp-user';

export interface StoredUser {
  username: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private userSignal = signal<StoredUser | null>(this.readUser());
  readonly currentUser = this.userSignal.asReadonly();

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setSession(token: string, user: StoredUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private readUser(): StoredUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  }
}