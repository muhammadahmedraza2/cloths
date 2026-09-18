import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashCard {
  label: string;
  icon: string;
  formId: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  cards: DashCard[] = [
    { label: 'Sales Order', icon: 'bi-cart-check', formId: 2001, color: 'primary' },
    { label: 'Purchase Order', icon: 'bi-bag-check', formId: 3001, color: 'success' },
    { label: 'Stationery Setup', icon: 'bi-gear', formId: 1047, color: 'info' },
    { label: 'Stock Overview', icon: 'bi-box-seam', formId: 4001, color: 'warning' },
    { label: 'Payment Voucher', icon: 'bi-wallet2', formId: 5001, color: 'danger' },
    { label: 'Receipt Voucher', icon: 'bi-receipt', formId: 6001, color: 'secondary' },
    { label: 'Customer Ledger', icon: 'bi-people', formId: 6002, color: 'primary' },
    { label: 'Shopping Cart', icon: 'bi-heart', formId: 7001, color: 'success' },
  ];
}
