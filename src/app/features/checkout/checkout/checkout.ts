import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';
import { ShopService } from '../../../core/services/shop.service';
import { Address, PaymentMethod, Order } from '../../../core/models/shop.model';

@Component({selector:'app-checkout',standalone:true,imports:[CommonModule,ReactiveFormsModule,DecimalPipe],templateUrl:'./checkout.html'})
export class CheckoutComponent implements OnInit {
  cart=inject(CartService); api=inject(ShopService); private fb=inject(FormBuilder); private router=inject(Router);
  PaymentMethod=PaymentMethod; addresses:Address[]=[]; order?:Order; proofId=''; proofName=''; error=''; submitting=false; uploading=false;
  form=this.fb.nonNullable.group({
    shippingAddressId:['',Validators.required], paymentMethod:[PaymentMethod.CashOnDelivery,Validators.required],
    bankName:[''], transactionReference:[''], shippingAmount:[0,[Validators.required,Validators.min(0)]],
    addressLine:[''], city:[''], area:[''], postalCode:[''], country:['Pakistan']
  });
  get f(){return this.form.controls;}
  get bankTransfer(){return this.f.paymentMethod.value===PaymentMethod.OnlineBankTransfer;}
  ngOnInit(){this.api.addresses().subscribe({next:x=>{this.addresses=x;if(x.length)this.f.shippingAddressId.setValue(x.find(a=>a.isDefault)?.id??x[0].id);}});this.cart.loadCart().subscribe();}
  saveAddress(){
    const v=this.form.getRawValue(); if(!v.addressLine||!v.city){this.error='Address line and city are required.';return;}
    this.api.addAddress({addressLine:v.addressLine,city:v.city,area:v.area,postalCode:v.postalCode,country:v.country,isDefault:this.addresses.length===0}).subscribe({next:a=>{this.addresses=[a,...this.addresses];this.f.shippingAddressId.setValue(a.id);this.form.patchValue({addressLine:'',city:'',area:'',postalCode:''});this.error='';}});
  }
  fileChanged(e:Event){
    const file=(e.target as HTMLInputElement).files?.[0]; if(!file)return;
    this.uploading=true;this.api.uploadProof(file).subscribe({next:r=>{this.proofId=r.id;this.proofName=r.originalFileName;this.uploading=false;},error:()=>{this.uploading=false;this.error='Payment proof upload failed.';}});
  }
  placeOrder(){
    if(this.form.invalid||this.cart.summary().items.length===0){this.form.markAllAsTouched();this.error='Please select an address and ensure cart is not empty.';return;}
    if(this.bankTransfer && !this.proofId){this.error='Online bank transfer ke liye payment proof upload karein.';return;}
    if(this.bankTransfer && !this.f.transactionReference.value.trim()){this.error='Transaction/reference number required hai.';return;}
    this.error='';this.submitting=true;const v=this.form.getRawValue();
    this.cart.checkout({shippingAddressId:v.shippingAddressId,paymentMethod:v.paymentMethod,shippingAmount:v.shippingAmount,bankName:v.bankName||undefined,transactionReference:v.transactionReference||undefined,paymentProofId:this.proofId||undefined}).subscribe({
      next:o=>{this.order=o;this.submitting=false;},error:e=>{this.submitting=false;this.error=e?.error?.message||'Checkout failed.';}
    });
  }
  print(){if(this.order)this.api.invoicePrint(this.order.id).subscribe(html=>{const w=window.open('','_blank');if(w){w.document.write(html);w.document.close();}});}
  orders(){this.router.navigate(['/app/orders']);}
}
