import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './header.html',
})
export class HeaderComponent {
  @Input() pageTitle = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  notifications = inject(NotificationService);
  showNotifPanel = false;

  constructor(private router: Router, private auth: AuthService, private menuService: MenuService) {}

  get currentUser() {
    return this.auth.currentUser();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  goHome(): void {
    this.router.navigate(['/app/dashboard']);
  }

  toggleNotifPanel(): void {
    this.showNotifPanel = !this.showNotifPanel;
    if (this.showNotifPanel) {
      this.notifications.markAllRead();
    }
  }

  logout(): void {
    this.auth.logout();
    this.menuService.clearCache();
    this.router.navigate(['/login']);
  }
}
