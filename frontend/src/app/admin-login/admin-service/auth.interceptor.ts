import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(res => {
            
            authService.saveTokens(res.accessToken, res.refreshToken);
        
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
            });
        
            return next(newReq);
          }),
          catchError(refreshErr => {
            console.error('Erreur lors du refresh:', refreshErr);
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
        
      }
      return throwError(() => err);
    })
  );
};
