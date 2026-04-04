import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiLogin = 'http://127.0.0.1:9990/api/auth/login';
  private apiRefresh = 'http://127.0.0.1:9990/api/auth/refresh';

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiLogin, { email, password }).pipe(
      tap(res => this.saveTokens(res.accessToken, res.refreshToken))
    );
  }
  
  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    console.log('Refresh token utilisé:', refreshToken);
    if (!refreshToken) throw new Error('Refresh token manquant');

    return this.http.post<RefreshResponse>(this.apiRefresh, { refreshToken }).pipe(
      tap(res => this.saveTokens(res.accessToken, res.refreshToken))
    );
  }

  saveTokens(accessToken: string, refreshToken: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.accessTokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }


  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.accessTokenKey);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  clearTokens() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.router.navigate(['/admin-login']);
  }

  logout() {
    this.clearTokens();
  }
  

  getToken(): string | null {
    return this.getAccessToken();
  }
  
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  
}
