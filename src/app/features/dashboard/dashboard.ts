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
  formId: number;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private auth = inject(AuthService);

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get userName(): string {
    return this.auth.currentUser()?.fullName || 'Guest';
  }

  // ---- Admin dashboard: quick links into ERP setup/transaction screens ----
  cards: DashCard[] = [
    { label: 'Sales Order', icon: 'bi-cart-check', formId: 2001, color: 'primary' },
    { label: 'Purchase Order', icon: 'bi-bag-check', formId: 3001, color: 'success' },
    { label: 'Product Setup', icon: 'bi-gear', formId: 1102, color: 'info' },
    { label: 'Stock Overview', icon: 'bi-box-seam', formId: 4001, color: 'warning' },
    { label: 'Payment Voucher', icon: 'bi-wallet2', formId: 5001, color: 'danger' },
    { label: 'Receipt Voucher', icon: 'bi-receipt', formId: 6001, color: 'secondary' },
    { label: 'Customer Ledger', icon: 'bi-people', formId: 6002, color: 'primary' },
    { label: 'Bank Setup', icon: 'bi-bank', formId: 1103, color: 'success' },
  ];

  // ---- Customer dashboard: hero carousel + shop-by-category ----
  banners = [
    {
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
      title: 'New Season Arrivals',
      subtitle: 'Fresh cuts, fresh colors — check out this week\u2019s new stock',
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
      title: 'Up to 30% Off',
      subtitle: 'Limited time discount on selected clothing',
    },
    {
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80',
      title: 'Everyday Essentials',
      subtitle: 'Comfortable, durable, and affordable fabric for daily wear',
    },
  ];

  categories: ShopCategory[] = [
    { label: 'Shop All Products', formId: 1102, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80' },
    { label: 'Men\u2019s Wear', formId: 1102, image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80' },
    { label: 'Women\u2019s Wear', formId: 1102, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
    { label: 'Kids\u2019 Wear', formId: 1102, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80' },
  ];
}
