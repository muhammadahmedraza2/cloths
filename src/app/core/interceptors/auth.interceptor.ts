import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token =
    tokenService.getToken();

  const isApiCall =
    req.url.startsWith(
      environment.apiUrl
    );

  const url =
    req.url.toLowerCase();

  const isLoginCall =
    url.includes('/auth/login');

  const isLogoutCall =
    url.includes('/auth/logout');

  const isRefreshCall =
    url.includes('/auth/refresh');

  const authReq =
    token && isApiCall
      ? req.clone({
          setHeaders: {
            Authorization:
              `Bearer ${token}`
          }
        })
      : req;

  return next(authReq).pipe(

    catchError(error => {

      if (
        error.status === 401 &&
        !isLoginCall &&
        !isLogoutCall &&
        !isRefreshCall
      ) {
        tokenService.clearSession();

        router.navigate(
          ['/login']
        );
      }

      return throwError(
        () => error
      );
    })
  );
};