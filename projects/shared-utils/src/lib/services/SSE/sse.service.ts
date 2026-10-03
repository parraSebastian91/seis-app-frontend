import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SSEService {
  private eventFacturas: EventSource | null = null;
  private eventNotificaciones: EventSource | null = null;
  private eventPublicacion: EventSource | null = null;

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

  /**
   * Avance del procesamiento de los documentos que subió este usuario.
   *
   * Un solo stream por usuario y no uno por archivo: el drawer sube varias
   * facturas a la vez y abrir una conexión por cada una multiplicaría las
   * conexiones justo en el momento de más carga. Cada mensaje trae su
   * `correlationId` —el mismo que viajó con el archivo por todo el pipeline— y
   * quien escucha filtra, que es barato.
   */
  getPublicacionStream(baseUrl: string, usuario: string): Observable<any> {
    const endpoint = `${baseUrl}/api/bff/facturas/publicacion/stream?usuario=${encodeURIComponent(usuario)}`;
    return new Observable((observer: any) => {
      this.eventPublicacion?.close();
      this.eventPublicacion = new EventSource(endpoint);

      // `onmessage` sólo recibe los eventos sin `type`. El backend etiqueta los
      // suyos (`documento.procesado`, `documento.fallido`, `heartbeat`), así que
      // hay que escucharlos por nombre o no llega nada.
      for (const tipo of ['documento.procesado', 'documento.fallido']) {
        this.eventPublicacion.addEventListener(tipo, (event: MessageEvent) => {
          this.zone.run(() => observer.next(JSON.parse(event.data)));
        });
      }

      this.eventPublicacion.onerror = (error) => {
        this.zone.run(() => {
          // CONNECTING significa que EventSource está reintentando solo; cortar
          // el Observable ahí mataría la reconexión automática.
          if (this.eventPublicacion?.readyState === EventSource.CLOSED) {
            observer.error(error);
          }
        });
      };

      return () => {
        this.eventPublicacion?.close();
        this.eventPublicacion = null;
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
