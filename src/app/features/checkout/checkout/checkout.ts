import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/Cart.Service';
import { CheckoutResponse, PaymentMethod } from '../../../core/models/cart.model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private router = inject(Router);

  PaymentMethod = PaymentMethod; // template mein enum use karne ke liye

  paymentMethod: PaymentMethod = PaymentMethod.Cash;
  bankName = '';
  accountNumber = '';
  transactionReference = '';
  amountPaid: number | null = null;

  orderPlaced = false;
  orderResult?: CheckoutResponse;
  errorMsg = '';
  submitting = false;

  get needsBankDetails(): boolean {
    return this.paymentMethod !== PaymentMethod.Cash;
  }

  placeOrder(): void {
    if (this.needsBankDetails && !this.transactionReference.trim()) {
      this.errorMsg = 'Please enter the transaction reference number.';
      return;
    }

    this.errorMsg = '';
    this.submitting = true;

    this.cart.checkout({
      paymentMethod: this.paymentMethod,
      bankName: this.needsBankDetails ? this.bankName : undefined,
      accountNumber: this.needsBankDetails ? this.accountNumber : undefined,
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