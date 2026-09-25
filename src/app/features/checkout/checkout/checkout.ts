import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/Cart.Service';
import { ShopService } from '../../../core/services/shop.service';
import { Address, PaymentMethod, Order } from '../../../core/models/shop.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  readonly cart = inject(CartService);
  readonly api = inject(ShopService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly PaymentMethod = PaymentMethod;

  addresses: Address[] = [];
  order?: Order;
  proofId = '';
  proofName = '';
  error = '';
  submitting = false;
  uploading = false;

  form = this.fb.nonNullable.group({
    shippingAddressId: ['', Validators.required],
    paymentMethod: [PaymentMethod.CashOnDelivery, Validators.required],
    bankName: [''],
    transactionReference: [''],
    shippingAmount: [0, [Validators.required, Validators.min(0)]],
    addressLine: [''],
    city: [''],
    area: [''],
    postalCode: [''],
    country: ['Pakistan']
  });

  get f() {
    return this.form.controls;
  }

  get bankTransfer() {
    return this.f.paymentMethod.value === PaymentMethod.OnlineBankTransfer;
  }

  ngOnInit(): void {
    this.api.addresses().subscribe({
      next: addresses => {
        this.addresses = addresses;

        if (addresses.length) {
          this.f.shippingAddressId.setValue(
            addresses.find(x => x.isDefault)?.id ?? addresses[0].id
          );
        }
      }
    });

    this.cart.loadCart().subscribe({
      next: cart => {
        if (!cart.items.length) this.router.navigate(['/app/cart']);
      },
      error: () => this.error = 'Could not load your cart. Please try again.'
    });
  }

  saveAddress(): void {
    const v = this.form.getRawValue();

    if (!v.addressLine || !v.city) {
      this.error = 'Address line and city are required.';
      return;
    }

    this.api.addAddress({
      addressLine: v.addressLine,
      city: v.city,
      area: v.area,
      postalCode: v.postalCode,
      country: v.country,
      isDefault: !this.addresses.length
    }).subscribe({
      next: address => {
        this.addresses = [address, ...this.addresses];
        this.f.shippingAddressId.setValue(address.id);
        this.form.patchValue({
          addressLine: '',
          city: '',
          area: '',
          postalCode: ''
        });
        this.error = '';
      },
      error: () => this.error = 'Could not save the address.'
    });
  }

  fileChanged(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading = true;

    this.api.uploadProof(file).subscribe({
      next: result => {
        this.proofId = result.id;
        this.proofName = result.originalFileName;
        this.uploading = false;
      },
      error: () => {
        this.uploading = false;
        this.error = 'Payment proof upload failed.';
      }
    });
  }

  placeOrder(): void {
    if (this.form.invalid || !this.cart.summary().items.length) {
      this.form.markAllAsTouched();
      this.error = 'Please select an address and ensure cart is not empty.';
      return;
    }

    if (this.bankTransfer && !this.proofId) {
      this.error = 'Online bank transfer ke liye payment proof upload karein.';
      return;
    }

    if (this.bankTransfer && !this.f.transactionReference.value.trim()) {
      this.error = 'Transaction/reference number required hai.';
      return;
    }

    this.error = '';
    this.submitting = true;

    const v = this.form.getRawValue();

    this.cart.checkout({
      shippingAddressId: v.shippingAddressId,
      paymentMethod: v.paymentMethod,
      shippingAmount: v.shippingAmount,
      bankName: v.bankName || undefined,
      transactionReference: v.transactionReference || undefined,
      paymentProofId: this.proofId || undefined
    }).subscribe({
      next: order => {
        this.order = order;
        this.submitting = false;
      },
      error: e => {
        this.submitting = false;
        this.error = e?.error?.message || 'Checkout failed.';
      }
    });
  }

  print(): void {
    if (!this.order) return;

    this.api.invoicePrint(this.order.id).subscribe(html => {
      const windowRef = window.open('', '_blank');

      if (windowRef) {
        windowRef.document.write(html);
        windowRef.document.close();
      }
    });
  }

  orders(): void {
    this.router.navigate(['/app/orders']);
  }
}