import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuNodeApi } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Menu`;

  // shareReplay(1) — cache karta hai taake sidebar aur kisi aur jagah dono se call ho to backend sirf 1x hit ho.
  private menu$?: Observable<MenuNodeApi[]>;

  getMenu(): Observable<MenuNodeApi[]> {
    if (!this.menu$) {
      this.menu$ = this.http.get<MenuNodeApi[]>(this.baseUrl).pipe(shareReplay(1));
    }
    return this.menu$;
  }

  /** Call after login/logout so the next getMenu() re-fetches fresh data. */
  clearCache(): void {
    this.menu$ = undefined;
  }
}