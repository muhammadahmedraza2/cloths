import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface DashCard {
  label: string;
  icon: string;
  formId: number;
  color: string;
}

interface ShopCategory {
  label: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {

  private readonly auth = inject(AuthService);

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get userName(): string {
    return this.auth.currentUser()?.fullName?.trim() ?? '';
  }

  // ================= ADMIN =================

  readonly cards: DashCard[] = [
    {
      label: 'Sales Order',
      icon: 'bi-cart-check',
      formId: 2001,
      color: 'primary'
    },
    {
      label: 'Purchase Order',
      icon: 'bi-bag-check',
      formId: 3001,
      color: 'success'
    },
    {
      label: 'Product Setup',
      icon: 'bi-box-seam',
      formId: 1102,
      color: 'info'
    },
    {
      label: 'Stock Overview',
      icon: 'bi-boxes',
      formId: 4001,
      color: 'warning'
    },
    {
      label: 'Payment Voucher',
      icon: 'bi-wallet2',
      formId: 5001,
      color: 'danger'
    },
    {
      label: 'Receipt Voucher',
      icon: 'bi-receipt',
      formId: 6001,
      color: 'secondary'
    },
    {
      label: 'Customer Ledger',
      icon: 'bi-people',
      formId: 6002,
      color: 'primary'
    },
    {
      label: 'Bank Setup',
      icon: 'bi-bank',
      formId: 1103,
      color: 'success'
    }
  ];

  // ================= CUSTOMER =================

  readonly categories: ShopCategory[] = [
    {
      label: "Men's Wear",
      image: 'assets/fashion.jpeg'
    },
    {
      label: "Women's Wear",
      image: 'assets/fashion2.jpeg'
    },
    {
      label: "Kids' Wear",
      image: 'assets/frok.jpeg'
    },
    {
      label: '2 Piece Collection',
      image: 'assets/2pieces.jpeg'
    }
  ];
}