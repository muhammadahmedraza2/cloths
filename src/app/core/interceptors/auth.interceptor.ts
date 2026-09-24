import { HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const injector = inject(Injector);

  // Token sirf apne backend ki requests ke saath jaye
  const isApiCall = req.url.startsWith(environment.apiUrl);
  const isLoginCall = req.url.toLowerCase().includes('/auth/login');

  const token = tokenService.getToken();
  const authReq =
    token && isApiCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Login ka galat password bhi 401 deta hai, us par session clear nahi karna
      if (error.status === 401 && !isLoginCall) {
        injector.get(AuthService).logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
