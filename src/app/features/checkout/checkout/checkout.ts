import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CheckoutResponse, PaymentMethod } from '../../../core/models/cart.model';
import { DecimalPipe } from '@angular/common';

interface BankOption {
  code: string;
  name: string;
}

const BANK_SETUP_FORM_ID = 1103; // matches Setup Management > Bank Setup

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
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
    amountPaid: this.fb.control<number | null>(null),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
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
}
