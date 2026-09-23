import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';
import { MasterDataService } from '../../../core/services/master-data.service';
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
  imports: [FormsModule,DecimalPipe],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
  cart = inject(CartService);
  private router = inject(Router);
  private masterData = inject(MasterDataService);

  PaymentMethod = PaymentMethod;

  paymentMethod: PaymentMethod = PaymentMethod.Cash;
  bankName = '';
  accountNumber = '';
  transactionReference = '';
  amountPaid: number | null = null;

  banks: BankOption[] = [];
  banksLoading = true;

  orderPlaced = false;
  orderResult?: CheckoutResponse;
  errorMsg = '';
  submitting = false;

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

  get needsBankDetails(): boolean {
    return this.paymentMethod !== PaymentMethod.Cash;
  }

  get isBankTransfer(): boolean {
    return this.paymentMethod === PaymentMethod.BankTransfer;
  }

  placeOrder(): void {
    if (this.isBankTransfer && !this.bankName) {
      this.errorMsg = 'Please select a bank.';
      return;
    }
    if (this.needsBankDetails && !this.transactionReference.trim()) {
      this.errorMsg = 'Please enter the transaction reference number.';
      return;
    }

    this.errorMsg = '';
    this.submitting = true;

    this.cart.checkout({
      paymentMethod: this.paymentMethod,
      bankName: this.isBankTransfer ? this.bankName : undefined,
      accountNumber: this.isBankTransfer ? this.accountNumber : undefined,
      transactionReference: this.needsBankDetails ? this.transactionReference : undefined,
      amountPaid: this.amountPaid ?? undefined,
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.orderResult = res;
        this.orderPlaced = true;
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