import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Añade `withCredentials: true` a todas las peticiones al mismo dominio.
 * Para peticiones a dominios externos (ej. S3 presigned URLs) se omite
 * para evitar errores CORS.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const isSameDomain =
    req.url.startsWith('/') ||
    (typeof window !== 'undefined' && req.url.includes(window.location.hostname));

  return next(isSameDomain ? req.clone({ withCredentials: true }) : req);
};
