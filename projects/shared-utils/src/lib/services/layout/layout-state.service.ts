import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  private readonly notificationsPanelOpenSubject = new BehaviorSubject<boolean>(false);
  readonly notificationsPanelOpen$ = this.notificationsPanelOpenSubject.asObservable();
  private readonly sidebarClosedSubject = new BehaviorSubject<boolean>(false);
  readonly sidebarClosed$ = this.sidebarClosedSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  setClassOnSelector(selector: string, className: string, enabled: boolean): void {
    const element = this.document.querySelector(selector);
    if (!element) return;

    element.classList.toggle(className, enabled);
  }

  setContainerNotificationsState(open: boolean): void {
    this.setClassOnSelector('.body', 'notifications-open', open);
  }

  setNotificationsPanelState(open: boolean): void {
    this.notificationsPanelOpenSubject.next(open);
    this.setContainerNotificationsState(open);
  }

  toggleNotificationsPanelState(): void {
    this.setNotificationsPanelState(!this.notificationsPanelOpenSubject.value);
  }

  setSidebarClosedState(closed: boolean): void {
    this.sidebarClosedSubject.next(closed);
    this.setClassOnSelector('.body', 'sidebar-closed', closed);
  }

  toggleSidebarState(): void {
    this.setSidebarClosedState(!this.sidebarClosedSubject.value);
  }
}
