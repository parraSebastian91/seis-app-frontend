import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import type { ApiResponse } from '../types/api-response.model';
import { USER_PROFILE_SERVICE_CONFIG, UserProfileServiceConfig } from '../UserProfile/userProfile.service';
import { HttpClient } from '@angular/common/http';
import { FacturaType } from '../types/factura.type';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private readonly notificationsPanelOpenSubject = new BehaviorSubject<boolean>(false);

  readonly notificationsPanelOpen$ = this.notificationsPanelOpenSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Optional() @Inject(USER_PROFILE_SERVICE_CONFIG) private config?: UserProfileServiceConfig
  ) { }

  async getFacturas(organizacionUUID: string): Promise<FacturaType[]> {

    const apiBase = this.config?.apiBase || '';
    const getFacturasUrl = `${apiBase}/api/bff/facturas/list/${organizacionUUID}`;

    const facturasRequest = this.http.get<ApiResponse<FacturaType[]>>(getFacturasUrl, {
      observe: 'response'
    });
    try {
      const response = await firstValueFrom(facturasRequest);

      // 2xx llega aquí; status fuera de 2xx cae en catch como HttpErrorResponse.
      if (response.status !== 200 || !response.body?.data) {
        throw new Error('Facturas sin contenido.');
      }

      return response.body.data;
    } catch (err) {
      console.error('Error fetching facturas:');
      console.error(err);
      throw err;
    }
  }

  setNotificationsPanelOpen(isOpen: boolean): void {
    this.notificationsPanelOpenSubject.next(isOpen);
  }
}