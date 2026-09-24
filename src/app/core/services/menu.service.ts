import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { Observable, map, shareReplay } from 'rxjs';
=======
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Apne project ke hisaab se path adjust kar lena
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
import { environment } from '../../../environments/environment';
import { MenuNodeApi } from '../models/menu.model';
import { AuthService } from './auth.service';

<<<<<<< HEAD
interface MenuResponse { pcId:number; role:string; menu:MenuNodeApi[]; }

@Injectable({providedIn:'root'})
export class MenuService {
  private http=inject(HttpClient); private auth=inject(AuthService); private menu$?:Observable<MenuNodeApi[]>;
  getMenu():Observable<MenuNodeApi[]>{
    if(!this.menu$){
      this.menu$=this.http.get<MenuResponse>(`${environment.apiUrl}/Menu`).pipe(
        map(res=>{
          const base=res?.menu??[];
          const shop:MenuNodeApi[]=[
            {id:9001,label:'Shop',icon:'bi-shop',route:'/app/shop',formId:null,children:[]},
            {id:9002,label:'Shopping Cart',icon:'bi-cart3',route:'/app/cart',formId:null,children:[]},
            {id:9003,label:'My Orders',icon:'bi-bag-check',route:'/app/orders',formId:null,children:[]},
            {id:9004,label:'My Profile',icon:'bi-person',route:'/app/profile',formId:null,children:[]}
          ];
          if(this.auth.isAdmin()) shop.push({id:9005,label:'Admin Console',icon:'bi-speedometer2',route:'/app/admin',formId:null,children:[]});
          return [...base,...shop];
        }),shareReplay(1));
    }
    return this.menu$;
  }
  clearCache(){this.menu$=undefined;}
}
=======
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
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
