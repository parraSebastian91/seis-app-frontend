import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Cabecera con la que el correlation id viaja por todo el stack. */
export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

/**
 * Pone un correlation id en cada request, para poder seguir una operación a
 * través del BFF, el orquestador, el worker y ms-core.
 *
 * **Respeta el que ya venga puesto.** Antes lo pisaba siempre, y eso dejaba al
 * frontend sin manera de saber qué id mandó: el valor nacía y moría acá. Para
 * una operación asíncrona —subir un PDF y esperar a que el pipeline cree la
 * factura— ese id ES el vínculo entre lo que se mandó y lo que vuelve, así que
 * quien inicia la operación tiene que poder elegirlo y recordarlo.
 */
@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.headers.has(CORRELATION_ID_HEADER)) {
      return next.handle(req);
    }

    return next.handle(req.clone({
      setHeaders: { [CORRELATION_ID_HEADER]: nuevoCorrelationId() },
    }));
  }
}

/** Genera un correlation id. Expuesto para quien necesite recordarlo. */
export function nuevoCorrelationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
