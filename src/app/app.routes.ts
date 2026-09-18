import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { MasterListComponent } from './features/master-list/master-list';
import { HelpComponent } from './features/help/help';
import { PrivacyComponent } from './features/privacy/privacy';
import { LoginComponent } from './features/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'master/:formId', component: MasterListComponent, data: { title: 'Setup' } },
      { path: 'help', component: HelpComponent, data: { title: 'Help & Support' } },
      { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy and Policies' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
