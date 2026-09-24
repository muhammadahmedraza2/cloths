import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus, PaymentStatus } from '../../core/models/shop.model';

@Component({selector:'app-orders',standalone:true,imports:[CommonModule,DecimalPipe],templateUrl:'./orders.html'})
export class OrdersComponent implements OnInit {
  api=inject(ShopService); auth=inject(AuthService); private route=inject(ActivatedRoute); private router=inject(Router);
  orders:Order[]=[]; selected?:Order; admin=false; error='';
  OrderStatus=OrderStatus; PaymentStatus=PaymentStatus;
  ngOnInit(){this.admin=this.auth.isAdmin();this.load();}
  load(){const req=this.admin?this.api.adminOrders():this.api.myOrders();req.subscribe({next:x=>this.orders=x,error:e=>this.error=e?.error?.message||'Orders load failed.'});}
  open(o:Order){this.api.order(o.id).subscribe(x=>this.selected=x);}
  print(o:Order){this.api.invoicePrint(o.id).subscribe(html=>{const w=window.open('','_blank');if(w){w.document.open();w.document.write(html);w.document.close();}});}
  updateStatus(o:Order,event:Event){const status=Number((event.target as HTMLSelectElement).value);this.api.updateOrderStatus(o.id,status).subscribe(()=>this.load());}
  updatePayment(o:Order,event:Event){const status=Number((event.target as HTMLSelectElement).value);const paymentId=(o as any).paymentId; if(paymentId)this.api.updatePaymentStatus(paymentId,status).subscribe(()=>this.load());}
  statusText(s:number){return OrderStatus[s]??s;}
  paymentText(s:number){return PaymentStatus[s]??s;}
}
