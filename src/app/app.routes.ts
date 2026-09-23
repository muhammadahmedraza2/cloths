import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { MasterListComponent } from './features/master-list/master-list';
import { HelpComponent } from './features/help/help';
import { PrivacyComponent } from './features/privacy/privacy';
import { LoginComponent } from './features/login/login';
import { CartComponent } from './features/cart/cart/cart';
import { CheckoutComponent } from './features/checkout/checkout/checkout';

export const routes: Routes = [
  // Temporary: Direct Dashboard access
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Main Application
  {
    path: 'app',
    component: MainLayoutComponent,

    // TEMPORARILY REMOVED
    // canActivate: [authGuard],

    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' }
      },
      {
        path: 'master/:formId',
        component: MasterListComponent,
        data: { title: 'Setup' }
      },
      {
        path: 'help',
        component: HelpComponent,
        data: { title: 'Help & Support' }
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
        data: { title: 'Privacy and Policies' }
      },
      {
        path: 'cart',
        component: CartComponent,
        data: { title: 'Shopping Cart' }
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: { title: 'Checkout' }
      },

      // /app -> /app/dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ],
  },

  // Unknown routes
  { path: '**', redirectTo: 'app/dashboard' },
];
