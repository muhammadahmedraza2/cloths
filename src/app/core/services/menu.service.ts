import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Apne project ke hisaab se path adjust kar lena
import { environment } from '../../../environments/environment';
import { MenuNodeApi } from '../models/menu.model';

interface MenuResponse {
  pcId: number;
  role: string;
  menu: MenuNodeApi[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  private menu$?: Observable<MenuNodeApi[]>;

  getMenu(): Observable<MenuNodeApi[]> {
    if (!this.menu$) {
      this.menu$ = this.http
        .get<MenuResponse>(`${environment.apiUrl}/Menu`)
        .pipe(
          map(res => res?.menu ?? []),
          shareReplay(1)
        );
    }
    return this.menu$;
  }

  // Logout ya login par call karo, warna purane user ka menu cache mein reh jata hai
  clearCache(): void {
    this.menu$ = undefined;
  }
}