import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { MasterListComponent } from './features/master-list/master-list';
import { HelpComponent } from './features/help/help';
import { PrivacyComponent } from './features/privacy/privacy';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { CartComponent } from './features/cart/cart/cart';
import { CheckoutComponent } from './features/checkout/checkout/checkout';
import { ShopComponent } from './features/shop/shop';
import { OrdersComponent } from './features/orders/orders';
import { ProfileComponent } from './features/profile/profile';
import { AdminComponent } from './features/admin/admin';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path:'', redirectTo:'app/dashboard', pathMatch:'full' },
  { path:'login', component:LoginComponent },
  { path:'register', component:RegisterComponent },
  { path:'app', component:MainLayoutComponent, canActivate:[authGuard], children:[
    {path:'dashboard',component:DashboardComponent,data:{title:'Dashboard'}},
    {path:'shop',component:ShopComponent,data:{title:'Kids Clothing Shop'}},
    {path:'cart',component:CartComponent,data:{title:'Shopping Cart'}},
    {path:'checkout',component:CheckoutComponent,data:{title:'Checkout'}},
    {path:'orders',component:OrdersComponent,data:{title:'Orders'}},
    {path:'profile',component:ProfileComponent,data:{title:'My Profile'}},
    {path:'admin',component:AdminComponent,canActivate:[adminGuard],data:{title:'Admin Console'}},
    {path:'master/:formId',component:MasterListComponent,data:{title:'Setup'}},
    {path:'help',component:HelpComponent,data:{title:'Help & Support'}},
    {path:'privacy',component:PrivacyComponent,data:{title:'Privacy and Policies'}},
    {path:'',redirectTo:'dashboard',pathMatch:'full'}
  ]},
  {path:'**',redirectTo:'app/dashboard'}
];
