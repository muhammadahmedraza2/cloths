import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  const isApiCall =
    req.url.startsWith(environment.apiUrl);

  const url = req.url.toLowerCase();

  const isLogin =
    url.includes('/auth/login');

  const isLogout =
    url.includes('/auth/logout');

  const isRefresh =
    url.includes('/auth/refresh');

  let authReq = req;

  if (token && isApiCall) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(

    catchError(error => {

      /*
       * Do not automatically logout from
       * authentication endpoints.
       */
      if (
        error.status === 401 &&
        !isLogin &&
        !isLogout &&
        !isRefresh
      ) {
        tokenService.clearSession();

        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};