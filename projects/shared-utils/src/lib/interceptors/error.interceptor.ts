import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppErrorService } from '../services/error/app-error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const appErrorService = inject(AppErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        console.error('[HTTP 403] Acceso denegado:', req.url);
        appErrorService.setAccessDenied();
      } else if (error.status >= 500) {
        console.error(`[HTTP ${error.status}] Error de servidor:`, req.url);
        appErrorService.setServerError();
      } else if (error.status === 0) {
        console.error('[HTTP 0] Error de red / timeout:', req.url);
        appErrorService.setNetworkError();
      }
      // 404 y otros se propagan sin interceptar
      return throwError(() => error);
    })
  );
};
