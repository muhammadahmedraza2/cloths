import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import { MenuNodeApi } from '../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, AsyncPipe],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  menu$!: Observable<MenuNodeApi[]>;
  expanded: Record<string, boolean> = {};

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menu$ = this.menuService.getMenu();
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