import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout';

import { DashboardComponent } from './features/dashboard/dashboard';
import { MasterListComponent } from './features/master-list/master-list';
import { HelpComponent } from './features/help/help';
import { PrivacyComponent } from './features/privacy/privacy';

import { LoginComponent } from './features/login/login';

import { CartComponent } from './features/cart/cart/cart';
import { WishlistComponent } from './features/wishlist/wishlist';
import { CheckoutComponent } from './features/checkout/checkout/checkout';
import { ShopComponent } from './features/shop/shop';
import { OrdersComponent } from './features/orders/orders';
import { ProfileComponent } from './features/profile/profile';
import { AdminComponent } from './features/admin/admin';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';
import { formAccessGuard } from './core/guards/form-access.guard';

export const routes: Routes = [

  // =========================================================
  // CUSTOMER PUBLIC WEBSITE
  // =========================================================

  {
    path: '',
    component: ShopComponent,
  },

  {
    path: 'shop',
    component: ShopComponent,
  },

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
  },

  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard],
  },

  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },

  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },

  {
    path: 'help',
    component: HelpComponent,
  },

  {
    path: 'privacy',
    component: PrivacyComponent,
  },

  // =========================================================
  // ADMIN LOGIN
  // =========================================================

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  // =========================================================
  // ADMIN AREA
  // =========================================================

  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard, adminGuard],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      // -----------------------------------------------------
      // ADMIN DASHBOARD
      // -----------------------------------------------------

      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
        },
      },

      // Admin can also use the same storefront/cart/order screens.
      {
        path: 'shop',
        component: ShopComponent,
        data: { title: 'Shop' },
      },
      {
        path: 'cart',
        component: CartComponent,
        data: { title: 'Shopping Cart' },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: { title: 'Orders' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' },
      },

      // -----------------------------------------------------
      // ADMIN FORM ROUTES
      // -----------------------------------------------------

      {
        path: 'master/:formId',
        component: MasterListComponent,
        canActivate: [formAccessGuard],
        data: {
          title: 'Setup',
        },
      },

      {
        path: 'FrmList/:formId',
        component: MasterListComponent,
        canActivate: [formAccessGuard],
        data: {
          title: 'Setup',
        },
      },

      // -----------------------------------------------------
      // ADMIN CART / WISHLIST SPECIAL FORMS
      // -----------------------------------------------------

      {
        path: 'FrmList/7001',
        component: CartComponent,
        data: {
          title: 'Shopping Cart',
        },
      },

      {
        path: 'FrmList/7002',
        component: WishlistComponent,
        data: {
          title: 'Wishlist',
        },
      },

      // -----------------------------------------------------
      // ADMIN CONSOLE
      // -----------------------------------------------------

      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [adminGuard],
        data: {
          title: 'Admin Console',
        },
      },

    ],
  },

  // =========================================================
  // UNKNOWN ROUTE
  // =========================================================

  {
    path: '**',
    redirectTo: '',
  },
];