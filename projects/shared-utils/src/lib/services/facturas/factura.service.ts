import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
    private readonly notificationsPanelOpenSubject = new BehaviorSubject<boolean>(false);

    readonly notificationsPanelOpen$ = this.notificationsPanelOpenSubject.asObservable();

    getFacturas() {
        
        const userProfile = this.http.get<ApiResponse<UserProfile>>(profileUrl, {
              observe: 'response'
            });
            try {
              const response = await firstValueFrom(userProfile);
        
              // 2xx llega aquí; status fuera de 2xx cae en catch como HttpErrorResponse.
              if (response.status !== 200 || !response.body?.data) {
                throw new Error('Perfil de usuario sin contenido.');
              }
        
              return response.body.data;
            } catch (err) {
              console.error('Error fetching user profile:');
              console.error(err);
              throw err;
            }

        return [
            { id: 1, cliente: 'Cliente A', monto: 100 },
            { id: 2, cliente: 'Cliente B', monto: 200 },
            { id: 3, cliente: 'Cliente C', monto: 300 }
        ];
    }

    setNotificationsPanelOpen(isOpen: boolean): void {
        this.notificationsPanelOpenSubject.next(isOpen);
    }
}