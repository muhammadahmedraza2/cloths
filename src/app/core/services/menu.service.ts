import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuNodeApi } from '../models/menu.model';
import { AuthService } from './auth.service';

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
