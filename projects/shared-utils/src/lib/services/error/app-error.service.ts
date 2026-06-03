import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppErrorService {
  /** 403 — recurso denegado */
  readonly accessDenied = signal(false);
  /** 500 / 502 / 503 — error de servidor */
  readonly serverError = signal(false);
  /** status 0 / timeout — sin conexión */
  readonly networkError = signal(false);

  setAccessDenied(): void {
    this.accessDenied.set(true);
  }

  setServerError(): void {
    this.serverError.set(true);
  }

  setNetworkError(): void {
    this.networkError.set(true);
  }

  clearAll(): void {
    this.accessDenied.set(false);
    this.serverError.set(false);
    this.networkError.set(false);
  }
}
