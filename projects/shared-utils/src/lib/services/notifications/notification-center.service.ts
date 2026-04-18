import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: Date;
  read: boolean;
}

export interface NotificationSection {
  id: string;
  name: string;
  icon: string;
  notifications: NotificationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationCenterService {
  private readonly sectionsSubject = new BehaviorSubject<NotificationSection[]>([]);
  readonly sections$ = this.sectionsSubject.asObservable();

  private initialized = false;

  get sections(): NotificationSection[] {
    return this.sectionsSubject.value;
  }

  get totalUnread(): number {
    return this.sections.reduce(
      (sum, section) => sum + section.notifications.filter(notification => !notification.read).length,
      0
    );
  }

  ensureInitializedWithMockData(): void {
    if (this.initialized) return;

    this.initialized = true;
    this.sectionsSubject.next([
      {
        id: 'orders',
        name: 'Pedidos',
        icon: 'shopping_cart',
        notifications: [
          { id: '1', title: 'Nuevo pedido #12345', timestamp: new Date(Date.now() - 3600000), read: false },
          { id: '2', title: 'Pedido #12344 actualizado', timestamp: new Date(Date.now() - 7200000), read: false }
        ]
      },
      {
        id: 'invoices',
        name: 'Facturas',
        icon: 'receipt',
        notifications: [
          { id: '3', title: 'Factura #F-001 emitida', timestamp: new Date(Date.now() - 1800000), read: true }
        ]
      },
      {
        id: 'messages',
        name: 'Mensajes',
        icon: 'mail',
        notifications: [
          { id: '4', title: 'Nuevo mensaje de Admin', timestamp: new Date(Date.now() - 600000), read: false },
          { id: '5', title: 'Mensaje del Sistema', timestamp: new Date(Date.now() - 900000), read: false },
          { id: '6', title: 'Respuesta a tu consulta', timestamp: new Date(Date.now() - 1200000), read: true }
        ]
      },
      {
        id: 'alerts',
        name: 'Alertas',
        icon: 'warning',
        notifications: []
      }
    ]);
  }

  markAsRead(notificationId: string): void {
    const updatedSections = this.sections.map(section => ({
      ...section,
      notifications: section.notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    }));

    this.sectionsSubject.next(updatedSections);
  }

  clearSection(sectionId: string): void {
    const updatedSections = this.sections.map(section =>
      section.id === sectionId ? { ...section, notifications: [] } : section
    );

    this.sectionsSubject.next(updatedSections);
  }

  clearAll(): void {
    const updatedSections = this.sections.map(section => ({
      ...section,
      notifications: []
    }));

    this.sectionsSubject.next(updatedSections);
  }
}
