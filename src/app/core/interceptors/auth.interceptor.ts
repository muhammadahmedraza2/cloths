import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const url = req.url.toLowerCase();

  const isApiCall = req.url.startsWith(environment.apiUrl);

  const isLoginCall = url.includes('/auth/login');
  const isLogoutCall = url.includes('/auth/logout');
  const isRefreshCall = url.includes('/auth/refresh');

  const token = tokenService.getToken();

  /*
   * Attach JWT to every API request.
   */
  const authReq =
    token && isApiCall
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

  return next(authReq).pipe(

    catchError((error) => {

      /*
       * Do not logout recursively for authentication endpoints.
       */
      if (
        error.status === 401 &&
        !isLoginCall &&
        !isLogoutCall &&
        !isRefreshCall
      ) {
        tokenService.clearSession();

        router.navigate(['/login'], {
          queryParams: {
            returnUrl: router.url
          }
        });
      }

      return throwError(() => error);
    })
  );
};