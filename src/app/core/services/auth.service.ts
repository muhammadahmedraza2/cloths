import { Injectable, signal } from '@angular/core';

export interface AppUser {
  username: string;
  fullName: string;
  role: string;
}

const STORAGE_KEY = 'clothing-erp-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<AppUser | null>(this.readStoredUser());
  readonly currentUser = this.userSignal.asReadonly();

  private readStoredUser(): AppUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.userSignal() !== null;
  }

  /**
   * Demo login: any non-empty username/password combination succeeds.
   * Swap this out for a real HTTP call to your auth API.
   */
  login(username: string, password: string): boolean {
    if (!username.trim() || !password.trim()) {
      return false;
    }
    const user: AppUser = {
      username: username.trim(),
      fullName: username.trim(),
      role: 'Administrator',
    };
    this.userSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
