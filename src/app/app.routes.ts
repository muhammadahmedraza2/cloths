import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { MasterListComponent } from './features/master-list/master-list';
import { HelpComponent } from './features/help/help';
import { PrivacyComponent } from './features/privacy/privacy';
import { LoginComponent } from './features/login/login';
import { CartComponent } from './features/cart/cart/cart';
import { CheckoutComponent } from './features/checkout/checkout/checkout';
import { WishlistComponent } from './features/wishlist/wishlist';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { formAccessGuard } from './core/guards/form-access.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },

  // Login (pehle se login ho to dashboard par bhej deta hai)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },

  // Main Application (login zaroori)
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },

      // Sidebar ke "Carts/Wish" nodes: backend formId 7001 / 7002 deta hai.
      // Yeh generic master route se PEHLE hone chahiye, warna master-list khul jayegi.
      { path: 'master/7001', component: CartComponent, data: { title: 'Shopping Cart' } },
      { path: 'FrmList/7001', component: CartComponent, data: { title: 'Shopping Cart' } },
      { path: 'master/7002', component: WishlistComponent, data: { title: 'Wishlist' } },
      { path: 'FrmList/7002', component: WishlistComponent, data: { title: 'Wishlist' } },

      // Baaki sab forms (admin: sab, user: sirf products 1102)
      {
        path: 'master/:formId',
        component: MasterListComponent,
        canActivate: [formAccessGuard],
        data: { title: 'Setup' },
      },
      {
        // Backend ka RouteTemplate "/app/FrmList/{formId}" deta hai
        path: 'FrmList/:formId',
        component: MasterListComponent,
        canActivate: [formAccessGuard],
        data: { title: 'Setup' },
      },

      { path: 'cart', component: CartComponent, data: { title: 'Shopping Cart' } },
      { path: 'wishlist', component: WishlistComponent, data: { title: 'Wishlist' } },
      { path: 'checkout', component: CheckoutComponent, data: { title: 'Checkout' } },
      { path: 'help', component: HelpComponent, data: { title: 'Help & Support' } },
      { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy and Policies' } },

      // /app -> /app/dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Unknown routes
  { path: '**', redirectTo: 'app/dashboard' },
];
