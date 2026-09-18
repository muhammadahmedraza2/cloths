import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU } from '../../core/services/menu.config';
import { MenuNode } from '../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  @Input() open = true;
  @Output() closeSidebar = new EventEmitter<void>();

  menu: MenuNode[] = MENU;
  expanded: Record<string, boolean> = {};

  toggle(label: string): void {
    this.expanded[label] = !this.expanded[label];
  }

  /** Only collapses the sidebar on small/mobile screens; desktop stays untouched. */
  onLinkClick(): void {
    if (window.innerWidth < 992) {
      this.closeSidebar.emit();
    }
  }

  onBackdropClick(): void {
    this.closeSidebar.emit();
  }
}
