import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import { MenuNodeApi } from '../../core/models/menu.model';
import { AuthService } from '../../core/services/auth.service';

/**
 * Yeh groups sirf Admin ke liye hain (ERP back-office setup/inventory/finance).
 * Customer/User role ke liye sirf shopping wala hissa (Home, Product browsing, Cart/Wish, Help, Privacy) dikhega.
 * NOTE: Yeh sirf frontend-side safety filter hai — backend Menu API se bhi role-based
 * response bhejwana behtar hoga agar backend mein yeh support add ho sake.
 */
const ADMIN_ONLY_GROUPS = [
  'Sales Management',
  'Purchase Management',
  'Setup Management',
  'Inventory Management',
  'Payment/Payable',
  'Receipt-Receivable',
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, AsyncPipe],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private auth = inject(AuthService);

  menu$!: Observable<MenuNodeApi[]>;
  expanded: Record<string, boolean> = {};

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    const isAdmin = this.auth.isAdmin();
    this.menu$ = this.menuService.getMenu().pipe(
      map((menu) => (isAdmin ? menu : menu.filter((item) => !ADMIN_ONLY_GROUPS.includes(item.label))))
    );
  }

  toggle(label: string): void {
    this.expanded[label] = !this.expanded[label];
  }

  onBackdropClick(): void {
    this.closeSidebar.emit();
  }

  onLinkClick(): void {
    if (window.innerWidth < 992) {
      this.closeSidebar.emit();
    }
  }
}
