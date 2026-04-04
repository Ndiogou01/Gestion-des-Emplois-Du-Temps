import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../admin-login/admin-service/auth-service';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  isTokenValid(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;

    const token = this.authService.getAccessToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }


  canActivate() {
    if (this.isTokenValid()) {
      return of(true);
    }

    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      this.authService.logout();
      this.router.navigate(['/admin-login']);
      return of(false);
    }

    return this.authService.refreshToken().pipe(
      map(() => true),
      catchError(() => {
        this.authService.logout();
        this.router.navigate(['/admin-login']);
        return of(false);
      })
    );
  }

  canActivateChild() {
    return this.canActivate();
  }
}
