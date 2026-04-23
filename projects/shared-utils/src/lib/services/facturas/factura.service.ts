import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
    private readonly notificationsPanelOpenSubject = new BehaviorSubject<boolean>(false);

    readonly notificationsPanelOpen$ = this.notificationsPanelOpenSubject.asObservable();

    

    setNotificationsPanelOpen(isOpen: boolean): void {
        this.notificationsPanelOpenSubject.next(isOpen);
    }
}