import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(username: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        this.tokenService.setSession(res.token, {
          username: res.username,
          fullName: res.fullName,
          role: res.role,
        });
      })
    );
  }

  logout(): void {
    this.tokenService.clearSession();
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  get currentUser() {
    return this.tokenService.currentUser;
  }

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }
}