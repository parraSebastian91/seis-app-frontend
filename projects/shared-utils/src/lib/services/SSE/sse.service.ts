import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SSEService {
  private eventFacturas: EventSource | null = null;
  private eventNotificaciones: EventSource | null = null;

  constructor(private zone: NgZone) {}

  getFacturasStream(baseUrl: string, orgUuid: string): Observable<any> {
    const endppoint = `${baseUrl}/api/bff/facturas/marketPlace/stream?uuid=${orgUuid}&scope=all`;
    return new Observable((observer: any) => {
      // 1. Abrimos la conexión HTTP persistente con el BFF
      if(this.eventFacturas) {
        this.eventFacturas.close();
      }

      this.eventFacturas = new EventSource(endppoint);

      // 2. Escuchamos cuando el servidor nos envía una actualización
      this.eventFacturas.onmessage = (event) => {
        // Ejecutamos dentro de NgZone para que la vista de Angular se actualice mágicamente
        this.zone.run(() => {
          const data = JSON.parse(event.data);
          console.log('SSEService - Facturas stream data received:', data);
          observer.next(data); // Empujamos el encabezado de la factura al subscriptor
        });
      };


      // 3. Manejo de errores
      this.eventFacturas.onerror = (error) => {
        this.zone.run(() => {
          if (this.eventFacturas?.readyState === EventSource.CLOSED) {
            // Conexión cerrada permanentemente
            observer.error(error);
          }
          // readyState === CONNECTING: EventSource reconecta automáticamente, no terminar el Observable
        });
      };

      // 4. Regla de limpieza (Si el componente se destruye, cerramos la cañería)
      return () => {
        this.eventFacturas?.close();
      };
    });
  }

  getNotificationsStream(url: string): Observable<any> {
    return new Observable((observer: any) => {

      if(this.eventNotificaciones) {
        this.eventNotificaciones.close();
      }

      this.eventNotificaciones = new EventSource(url);

      this.eventNotificaciones.onmessage = (event) => {
        this.zone.run(() => {
          const data = JSON.parse(event.data);
          observer.next(data);
        });
      };

      this.eventNotificaciones.onerror = (error) => {
        this.zone.run(() => {
          if (this.eventNotificaciones?.readyState === EventSource.CLOSED) {
            observer.error(error);
          }
        });
      };

      return () => {
        this.eventNotificaciones?.close();
      };
    });
  }
}
