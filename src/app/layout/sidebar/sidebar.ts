import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal
} from '@angular/core';

import {
  AsyncPipe,
  NgClass
} from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  Observable,
  of
} from 'rxjs';

import {
  catchError
} from 'rxjs/operators';

import {
  MenuService
} from '../../core/services/menu.service';

import {
  MenuNodeApi
} from '../../core/models/menu.model';

// Backend jo .svg naam bhejta hai,
// unko Bootstrap Icons mein map kar rahe hain.
const ICON_MAP: Record<string, string> = {
  'cart.svg': 'bi-cart3',
  'bag.svg': 'bi-bag',
  'settings.svg': 'bi-gear',
  'box.svg': 'bi-box-seam',
  'wallet.svg': 'bi-wallet2',
  'receipt.svg': 'bi-receipt',
  'heart.svg': 'bi-heart'
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {

  @Input() open = false;

  @Output() closeSidebar =
    new EventEmitter<void>();

  private readonly menuService =
    inject(MenuService);

  menu$!: Observable<MenuNodeApi[]>;

  expanded: Record<string, boolean> = {};

  readonly searchTerm =
    signal('');

  readonly menuError =
    signal(false);

  ngOnInit(): void {

    this.menu$ =
      this.menuService
        .getMenu()
        .pipe(
          catchError(() => {

            this.menuError.set(true);

            return of(
              [] as MenuNodeApi[]
            );
          })
        );
  }

  iconClass(
    icon?: string | null
  ): string {

    if (!icon) {
      return 'bi-circle';
    }

    return (
      ICON_MAP[icon.toLowerCase()] ??
      (
        icon.startsWith('bi-')
          ? icon
          : 'bi-circle'
      )
    );
  }

  /**
   * Search by parent or child interface name.
   */
  filterMenu(
    menu: MenuNodeApi[],
    term: string
  ): MenuNodeApi[] {

    const search =
      term
        .trim()
        .toLowerCase();

    if (!search) {
      return menu;
    }

    return menu
      .map((item) => {

        // Parent match
        if (
          item.label
            .toLowerCase()
            .includes(search)
        ) {
          return item;
        }

        // Child match
        const children =
          (item.children ?? [])
            .filter((child) =>
              child.label
                .toLowerCase()
                .includes(search)
            );

        if (children.length) {

          return {
            ...item,
            children
          };
        }

        return null;
      })
      .filter(
        (
          item
        ): item is MenuNodeApi =>
          item !== null
      );
  }

  isExpanded(
    item: MenuNodeApi
  ): boolean {

    return (
      !!this.searchTerm().trim() ||
      !!this.expanded[item.label]
    );
  }

  toggle(
    label: string
  ): void {

    this.expanded[label] =
      !this.expanded[label];
  }

  onSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(
      input.value
    );
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