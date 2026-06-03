import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Serializa las llamadas concurrentes al endpoint de refresh:
 * si hay un refresh en curso, devuelve el mismo Observable compartido
 * en lugar de lanzar una segunda petición.
 */
@Injectable({ providedIn: 'root' })
export class AuthRefreshService {
  private ongoing$: Observable<unknown> | null = null;

  getOrStartRefresh(http: HttpClient, refreshUrl: string): Observable<unknown> {
    if (!this.ongoing$) {
      this.ongoing$ = http
        .post(refreshUrl, {}, { withCredentials: true })
        .pipe(
          shareReplay(1),
          finalize(() => {
            this.ongoing$ = null;
          })
        );
    }
    return this.ongoing$;
  }
}
