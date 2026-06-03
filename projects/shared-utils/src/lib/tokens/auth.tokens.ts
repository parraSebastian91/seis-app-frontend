import { InjectionToken } from '@angular/core';

/** URL del endpoint de refresh de sesión. Ej: /api/auth/security/session/refresh */
export const AUTH_REFRESH_URL = new InjectionToken<string>('AUTH_REFRESH_URL', {
  providedIn: 'root',
  factory: () => '/api/auth/security/session/refresh',
});

/** URL de la app de login a la que redirigir cuando la sesión expire. */
export const LOGIN_APP_URL = new InjectionToken<string>('LOGIN_APP_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:8082',
});
