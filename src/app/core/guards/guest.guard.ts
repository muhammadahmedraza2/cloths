import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/** Pehle se login user /login khole to seedha dashboard bhej do. */
export const guestGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.isLoggedIn() ? router.createUrlTree(['/app/dashboard']) : true;
};
