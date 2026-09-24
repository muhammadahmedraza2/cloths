import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { CartService } from '../../core/services/Cart.Service';
import { Product, Category, Size, Color, AgeGroup } from '../../core/models/shop.model';

@Component({ selector:'app-shop', standalone:true, imports:[CommonModule,ReactiveFormsModule,DecimalPipe], templateUrl:'./shop.html' })
export class ShopComponent implements OnInit {
  private api=inject(ShopService); private cart=inject(CartService); private fb=inject(FormBuilder); private router=inject(Router);
  products: Product[]=[]; categories: Category[]=[]; sizes: Size[]=[]; colors: Color[]=[]; ages: AgeGroup[]=[]; error='';
  filter=this.fb.nonNullable.group({search:'',categoryId:'',ageGroupId:'',sizeId:'',colorId:''});
  ngOnInit(){ this.api.categories().subscribe(x=>this.categories=x); this.api.sizes().subscribe(x=>this.sizes=x); this.api.colors().subscribe(x=>this.colors=x); this.api.ageGroups().subscribe(x=>this.ages=x); this.load(); }
  load(){ this.api.products(this.filter.getRawValue()).subscribe({next:x=>this.products=x,error:e=>this.error=e?.error?.message||'Products load failed.'}); }
  add(p:Product){ const v=p.variants.find(x=>x.stockQuantity>0 && x.isActive); if(!v){this.error='Product is out of stock.';return;} this.cart.addToCart({productVariantId:v.id,quantity:1}).subscribe({next:()=>this.router.navigate(['/app/cart']),error:e=>this.error=e?.error?.message||'Could not add to cart.'}); }
  view(id:string){this.router.navigate(['/app/shop',id]);}
}
