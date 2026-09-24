import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Normal user ko sirf yeh forms khulne dete hain: 1102 = Products (shop browse). */
const USER_FORM_IDS = new Set<number>([1102]);

/**
 * /app/master/:formId aur /app/FrmList/:formId ke liye.
 * Admin ko sab forms, user ko sirf USER_FORM_IDS.
 * NOTE: yeh sirf UI ki hifazat hai, asal hifazat backend ke [Authorize(Roles = ...)] se hoti hai.
 */
export const formAccessGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  const formId = Number(route.paramMap.get('formId'));
  return USER_FORM_IDS.has(formId) ? true : router.createUrlTree(['/app/dashboard']);
};
