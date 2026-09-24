import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';
import { ShopService } from '../../../core/services/shop.service';
import { Address, PaymentMethod, Order } from '../../../core/models/shop.model';

@Component({selector:'app-checkout',standalone:true,imports:[CommonModule,ReactiveFormsModule,DecimalPipe],templateUrl:'./checkout.html'})
export class CheckoutComponent implements OnInit {
<<<<<<< HEAD
  cart=inject(CartService); api=inject(ShopService); private fb=inject(FormBuilder); private router=inject(Router);
  PaymentMethod=PaymentMethod; addresses:Address[]=[]; order?:Order; proofId=''; proofName=''; error=''; submitting=false; uploading=false;
  form=this.fb.nonNullable.group({
    shippingAddressId:['',Validators.required], paymentMethod:[PaymentMethod.CashOnDelivery,Validators.required],
    bankName:[''], transactionReference:[''], shippingAmount:[0,[Validators.required,Validators.min(0)]],
    addressLine:[''], city:[''], area:[''], postalCode:[''], country:['Pakistan']
=======
  cart = inject(CartService);
  private router = inject(Router);
  private masterData = inject(MasterDataService);
  private notifications = inject(NotificationService);
  private fb = inject(FormBuilder);

  PaymentMethod = PaymentMethod;

  banks: BankOption[] = [];
  banksLoading = true;

  orderPlaced = false;
  orderResult?: CheckoutResponse;
  errorMsg = '';
  submitting = false;

  form = this.fb.nonNullable.group({
    paymentMethod: [PaymentMethod.Cash, [Validators.required]],
    bankName: [''],
    accountNumber: [''],
    transactionReference: [''],
    amountPaid: this.fb.control<number | null>(null, [Validators.min(0)]),
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
  });
  get f(){return this.form.controls;}
  get bankTransfer(){return this.f.paymentMethod.value===PaymentMethod.OnlineBankTransfer;}
  ngOnInit(){this.api.addresses().subscribe({next:x=>{this.addresses=x;if(x.length)this.f.shippingAddressId.setValue(x.find(a=>a.isDefault)?.id??x[0].id);}});this.cart.loadCart().subscribe();}
  saveAddress(){
    const v=this.form.getRawValue(); if(!v.addressLine||!v.city){this.error='Address line and city are required.';return;}
    this.api.addAddress({addressLine:v.addressLine,city:v.city,area:v.area,postalCode:v.postalCode,country:v.country,isDefault:this.addresses.length===0}).subscribe({next:a=>{this.addresses=[a,...this.addresses];this.f.shippingAddressId.setValue(a.id);this.form.patchValue({addressLine:'',city:'',area:'',postalCode:''});this.error='';}});
  }
<<<<<<< HEAD
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
=======

  ngOnInit(): void {
    // Page refresh par cart memory se ud jata hai, is liye dobara load karo.
    // Cart khali ho to checkout ka faida nahi, cart page par bhej do.
    this.cart.loadCart().subscribe({
      next: (summary) => {
        if (summary.items.length === 0 && !this.orderPlaced) {
          this.router.navigate(['/app/cart']);
        }
      },
      error: () => (this.errorMsg = 'Could not load your cart. Please try again.'),
    });

    // Pull the bank list live from Bank Setup (Setup Management) — no hardcoding.
    this.masterData.getRecords(BANK_SETUP_FORM_ID, 'authorized').subscribe({
      next: (records) => {
        this.banks = records
          .map((r) => ({ code: r.fields['code'] ?? '', name: r.fields['name'] ?? '' }))
          .filter((b) => b.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.banksLoading = false;
      },
      error: () => {
        this.banksLoading = false; // fall back to free-text if the bank list can't load
      },
    });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.f.paymentMethod.setValue(method);
  }

  get needsBankDetails(): boolean {
    return this.f.paymentMethod.value !== PaymentMethod.Cash;
  }

  get isBankTransfer(): boolean {
    return this.f.paymentMethod.value === PaymentMethod.BankTransfer;
  }

  placeOrder(): void {
    const { paymentMethod, bankName, accountNumber, transactionReference, amountPaid } = this.form.getRawValue();

    if (amountPaid !== null && amountPaid < 0) {
      this.errorMsg = 'Amount paid cannot be negative.';
      return;
    }
    if (this.isBankTransfer && !bankName) {
      this.errorMsg = 'Please select a bank.';
      return;
    }
    if (this.needsBankDetails && !transactionReference.trim()) {
      this.errorMsg = 'Please enter the transaction reference number.';
      return;
    }

    this.errorMsg = '';
    this.submitting = true;

    this.cart.checkout({
      paymentMethod,
      bankName: this.isBankTransfer ? bankName : undefined,
      accountNumber: this.isBankTransfer ? accountNumber : undefined,
      transactionReference: this.needsBankDetails ? transactionReference : undefined,
      amountPaid: amountPaid ?? undefined,
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.orderResult = res;
        this.orderPlaced = true;

        // Admin ko notify karein ke naya order / payment aaya hai (Bank ya Cash).
        this.notifications.notifyPaymentReceived({
          orderNo: res.orderNo,
          amount: res.totalAmount,
          method: res.paymentMethod,
          status: res.paymentStatus,
        });
      },
      error: () => {
        this.submitting = false;
        this.errorMsg = 'Could not place order. Please try again.';
      },
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/app/dashboard']);
  }
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
}
