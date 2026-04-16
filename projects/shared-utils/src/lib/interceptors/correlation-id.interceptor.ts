import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestWithCorrelationId = req.clone({
      setHeaders: {
        'X-Correlation-Id': this.generateCorrelationId()
      }
    });

    return next.handle(requestWithCorrelationId);
  }

  private generateCorrelationId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
}
