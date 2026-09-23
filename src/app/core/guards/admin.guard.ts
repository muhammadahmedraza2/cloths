import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Sirf Admin role wale user ko route access karne deta hai.
 * Non-admin (customer) ko dashboard pe wapas bhej deta hai.
 */
export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn() && tokenService.isAdmin()) {
    return true;
  }
  router.navigate(['/app/dashboard']);
  return false;
};
