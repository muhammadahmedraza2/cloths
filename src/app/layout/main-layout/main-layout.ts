import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  // Mobile par sidebar band shuru ho (desktop par yeh flag use hi nahi hota)
  sidebarOpen = false;

  private routeTitle = 'Dashboard';
  private readonly pageTitleService = inject(PageTitleService);

  /** Master forms ka title form ke naam se, baaki routes ka title route data se. */
  get pageTitle(): string {
    return this.pageTitleService.override() ?? this.routeTitle;
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let r = this.route;
          while (r.firstChild) {
            r = r.firstChild;
          }
          return r;
        }),
        mergeMap((r) => r.data)
      )
      .subscribe((data) => {
        this.routeTitle = data['title'] || 'Dashboard';
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
