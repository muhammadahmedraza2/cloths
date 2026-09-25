import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
})
export class NotFoundComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  /** route data: { kind: 'forbidden' } to 403, warna 404 */
  readonly forbidden = this.route.snapshot.data['kind'] === 'forbidden';

  /** Jo URL user ne kholna chaha (master-list `?from=` bhejta hai, wildcard route par URL segments se) */
  readonly requestedUrl = this.route.snapshot.queryParamMap.get('from') ?? this.attemptedUrl();

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/app/dashboard']);
    }
  }

  private attemptedUrl(): string {
    const segments = this.route.pathFromRoot.flatMap((r) => r.snapshot.url.map((s) => s.path));
    const url = '/' + segments.join('/');
    return /\/(not-found|forbidden)$/.test(url) ? '' : url;
  }
}