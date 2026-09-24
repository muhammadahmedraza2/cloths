import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import { MenuNodeApi } from '../../core/models/menu.model';

// Backend jo .svg naam bhejta hai, unka Bootstrap icon
const ICON_MAP: Record<string, string> = {
  'cart.svg': 'bi-cart3',
  'bag.svg': 'bi-bag',
  'settings.svg': 'bi-gear',
  'box.svg': 'bi-box-seam',
  'wallet.svg': 'bi-wallet2',
  'receipt.svg': 'bi-receipt',
  'heart.svg': 'bi-heart',
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, AsyncPipe],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private readonly menuService = inject(MenuService);

  menu$!: Observable<MenuNodeApi[]>;
  expanded: Record<string, boolean> = {};

  ngOnInit(): void {
    this.menu$ = this.menuService.getMenu();
  }

  iconClass(icon?: string | null): string {
    if (!icon) return 'bi-circle';
    return ICON_MAP[icon.toLowerCase()] ?? (icon.startsWith('bi-') ? icon : 'bi-circle');
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