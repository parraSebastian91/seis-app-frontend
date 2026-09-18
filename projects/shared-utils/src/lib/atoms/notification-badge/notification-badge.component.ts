import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Punto/contador de notificación superpuesto en la esquina de un ícono —
 * reemplaza `matBadge`/`matBadgeColor` (top-navbar), que necesitaba
 * `::ng-deep .mat-badge-content { ... !important }` para poder pintarlo con
 * el color real de la marca en vez del rojo/ámbar de Material.
 *
 * El contenedor (el botón que envuelve el ícono) necesita `position: relative`
 * para que el badge se ancle correctamente a su esquina.
 *
 * Uso:
 *   <button class="btn-mini-fab" style="position: relative">
 *     <app-icon name="notifications" />
 *     <app-notification-badge [text]="unreadCount || null" [pulse]="justArrived" />
 *   </button>
 */
@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *ngIf="text" class="badge-dot" [class.badge-dot--pulse]="pulse">{{ text }}</span>
  `,
  styleUrl: './notification-badge.component.scss',
})
export class NotificationBadgeComponent {
  /** Texto/número a mostrar. El badge no se renderiza si es null/undefined/''/0. */
  @Input() text: string | number | null = null;
  /** Dispara una animación de "pulso" — usar cuando llega una notificación nueva. */
  @Input() pulse = false;
}
