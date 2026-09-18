import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  @Input() pageTitle = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router, private auth: AuthService) {}

  get currentUser() {
    return this.auth.currentUser();
  }

  goHome(): void {
    this.router.navigate(['/app/dashboard']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
