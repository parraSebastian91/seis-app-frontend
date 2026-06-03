import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SessionService } from '../services/session/session.service';
import { AuthRefreshService } from '../services/auth/auth-refresh.service';
import { AUTH_REFRESH_URL, LOGIN_APP_URL } from '../tokens/auth.tokens';

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const sessionService = inject(SessionService);
  const authRefreshService = inject(AuthRefreshService);
  const refreshUrl = inject(AUTH_REFRESH_URL);
  const loginUrl = inject(LOGIN_APP_URL);

  const isRefreshRequest = req.url.includes(refreshUrl);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isRefreshRequest) {
        return throwError(() => error);
      }

      return authRefreshService.getOrStartRefresh(http, refreshUrl).pipe(
        switchMap(() => next(req.clone({ withCredentials: true }))),
        catchError(() => {
          sessionService.clearSession();
          if (typeof window !== 'undefined') {
            window.location.href = loginUrl;
          }
          return EMPTY;
        })
      );
    })
  );
};
