import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
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

<<<<<<< HEAD
  ngOnInit(): void {
    this.menu$ = this.menuService.getMenu();
  }

  iconClass(icon?: string | null): string {
    if (!icon) return 'bi-circle';
    return ICON_MAP[icon.toLowerCase()] ?? (icon.startsWith('bi-') ? icon : 'bi-circle');
=======
  readonly searchTerm = signal('');
  readonly menuError = signal(false);

  ngOnInit(): void {
    this.menu$ = this.menuService.getMenu().pipe(
      catchError(() => {
        // Backend band ho ya token kharab ho to sidebar "loading" par atka na rahe
        this.menuError.set(true);
        return of([] as MenuNodeApi[]);
      })
    );
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
  }

  iconClass(icon?: string | null): string {
    if (!icon) return 'bi-circle';
    return ICON_MAP[icon.toLowerCase()] ?? (icon.startsWith('bi-') ? icon : 'bi-circle');
  }

  /** "Search by Interface" box: parent ya child ke naam se filter. */
  filterMenu(menu: MenuNodeApi[], term: string): MenuNodeApi[] {
    const t = term.trim().toLowerCase();
    if (!t) return menu;

    return menu
      .map((item) => {
        if (item.label.toLowerCase().includes(t)) return item;
        const children = (item.children ?? []).filter((c) => c.label.toLowerCase().includes(t));
        return children.length ? { ...item, children } : null;
      })
      .filter((item): item is MenuNodeApi => item !== null);
  }

  isExpanded(item: MenuNodeApi): boolean {
    return !!this.searchTerm().trim() || !!this.expanded[item.label];
  }

  toggle(label: string): void {
    this.expanded[label] = !this.expanded[label];
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
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