import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import type { ApiResponse } from '../types/api-response.model';
import { USER_PROFILE_SERVICE_CONFIG, UserProfileServiceConfig } from '../UserProfile/userProfile.service';
import { HttpClient } from '@angular/common/http';
import { AutorizacionPublicacionDto, FacturaCreateRequestDto, facturaEstado, FacturaRequestDTO, FacturaResponseUpdateDTO, FacturaType, OfertaDetalleType, VersionTerminos } from '../types/factura.type';

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

  async getFacturas(organizacionUUID: string, tipoFiltro?: string): Promise<FacturaType[]> {
    let filtro = '';

    switch (tipoFiltro) {
      case 'Todas':
        filtro = '/all';
        break;
      case 'Publicadas':
        filtro = '/publicadas';
        break;
      default:
        filtro = '/xorganizacion';
    }

    const apiBase = this.config?.apiBase || '';
    const getFacturasUrl = `${apiBase}/api/bff/facturas/list/${organizacionUUID}${filtro}`;

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

  async updateFactura(factura: FacturaType, nombreCampo: string, valorCampo: string): Promise<FacturaResponseUpdateDTO> {
    const body: FacturaRequestDTO = {
      id: factura.facturaId,
      ownerUUID: factura.ownerUUID,
      gestor: {
        uuid: factura.gestor.uuid,
        username: factura.gestor.username
      },
      campoEditado: {
        nombre: nombreCampo,
        valor: valorCampo
      }
    }
    const apiBase = this.config?.apiBase || '';
    const updateFacturaUrl = `${apiBase}/api/bff/facturas`;

    const facturasUpdateRequest = this.http.patch<ApiResponse<FacturaResponseUpdateDTO>>(updateFacturaUrl, body, {
      observe: 'response'
    });

    try {
      const response = await firstValueFrom(facturasUpdateRequest);

      // 2xx llega aquí; status fuera de 2xx cae en catch como HttpErrorResponse.
      if (response.status !== 200 || !response.body?.data) {
        throw new Error('Error updating factura.');
      }

      return response.body.data;
    } catch (err) {
      console.error('Error updating factura:');
      console.error(err);
      throw err;
    }
  }

  async publicarFactura(factura: FacturaCreateRequestDto): Promise<FacturaType> {
    const apiBase = this.config?.apiBase || '';
    const publicarFacturaUrl = `${apiBase}/api/bff/facturas`;
    try {
      const response = await firstValueFrom(this.http.post<ApiResponse<FacturaType>>(publicarFacturaUrl, factura, {
        observe: 'response'
      }));

      // 2xx llega aquí; status fuera de 2xx cae en catch como HttpErrorResponse.
      if (response.status !== 201 || !response.body?.data) {
        throw new Error('Error publishing factura.');
      }

      return response.body.data;
    } catch (err) {
      console.error('Error publishing factura:');
      console.error(err);
      throw err;
    }
  }

  resolveEstadoFromAuthorization(isAuthorized: { isConfirmed: boolean, isDenied: boolean, isDismissed: boolean, dismiss?: 'cancel', value?: boolean }): facturaEstado {
    console.log('Resolviendo estado de factura a partir de autorización:', isAuthorized);

    return isAuthorized.isConfirmed ? facturaEstado.PUBLICADA : facturaEstado.PENDIENTE_AUTORIZACION;
  }

  async actualizarEstadoFactura(factura: FacturaType, estado: facturaEstado): Promise<FacturaResponseUpdateDTO> {
    const response = await this.updateFactura(factura, 'status', estado);

    if (!this.isUpdateAccepted(response)) {
      throw new Error('Estado de factura no confirmado por backend.');
    }

    return response;
  }

  private isUpdateAccepted(response: FacturaResponseUpdateDTO | undefined): boolean {
    if (!response) {
      return false;
    }

    return response.isUpdate === true || response.isUpdate === 'true' || response.isUpdate === 1 || response.isUpdate === '1';
  }

  setNotificationsPanelOpen(isOpen: boolean): void {
    this.notificationsPanelOpenSubject.next(isOpen);
  }

  async obtenerVersionTerminosActiva(): Promise<VersionTerminos> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/terminos/activo`;
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<VersionTerminos>>(url, { observe: 'response' })
      );
      if (!response.body?.data) {
        throw new Error('Sin versión de términos activa.');
      }
      return response.body.data;
    } catch (err) {
      console.error('Error al obtener versión de términos:', err);
      throw err;
    }
  }

  async registrarAutorizacion(payload: AutorizacionPublicacionDto): Promise<void> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/facturas/autorizacion`;
    try {
      await firstValueFrom(
        this.http.post<ApiResponse<void>>(url, payload, { observe: 'response' })
      );
    } catch (err) {
      console.error('Error al registrar autorización:', err);
      throw err;
    }
  }

  async getFacturaById(facturaId: string): Promise<FacturaType> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/facturas/${facturaId}`;
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<FacturaType>>(url, { observe: 'response' })
      );
      if (!response.body?.data) {
        throw new Error('Factura no encontrada.');
      }
      return response.body.data;
    } catch (err) {
      console.error('Error al obtener factura:', err);
      throw err;
    }
  }

  async getOfertasByFacturaId(facturaId: string): Promise<OfertaDetalleType[]> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/facturas/${facturaId}/ofertas`;
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<OfertaDetalleType[]>>(url, { observe: 'response' })
      );
      return response.body?.data ?? [];
    } catch (err) {
      console.error('Error al obtener ofertas:', err);
      throw err;
    }
  }

  async aceptarOferta(ofertaId: string): Promise<void> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/ofertas/${ofertaId}/aceptar`;
    try {
      await firstValueFrom(
        this.http.post<ApiResponse<void>>(url, {}, { observe: 'response' })
      );
    } catch (err) {
      console.error('Error al aceptar oferta:', err);
      throw err;
    }
  }

  async rechazarOferta(ofertaId: string, motivo?: string): Promise<void> {
    const apiBase = this.config?.apiBase || '';
    const url = `${apiBase}/api/bff/ofertas/${ofertaId}/rechazar`;
    try {
      await firstValueFrom(
        this.http.post<ApiResponse<void>>(url, { motivo: motivo ?? '' }, { observe: 'response' })
      );
    } catch (err) {
      console.error('Error al rechazar oferta:', err);
      throw err;
    }
  }
}