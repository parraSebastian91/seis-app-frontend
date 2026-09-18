import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg';

/**
 * Avatar circular con fallback a iniciales — centraliza un patrón (imagen +
 * `getInitials()` idéntico letra por letra) que estaba duplicado en:
 *   - CardColaboradorComponent / CardOrganizacionComponent (shared-utils,
 *     mismo método `getInitials()` copiado en ambos)
 *   - admin-miembros (.avatar-placeholder, 40px)
 *   - admin-grupo-detalle (.leader-avatar__initials)
 *   - org-profile (.logo-placeholder)
 *   - user-profile/view (.profile-avatar-placeholder, 124px)
 *   - factura-detalle, cartera-leads
 *   - SearchableCardSelectComponent (.sc-avatar, 36px — además manejaba
 *     imagen rota con (error), que este atom incorpora vía [brokenImage])
 *
 * Uso:
 *   <app-avatar [src]="colaborador.avatarUrl" [name]="colaborador.nombre + ' ' + colaborador.apellido" />
 *   <app-avatar [src]="org.logoUrl" [name]="org.razonSocial" size="lg" />
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="avatar" [class]="'avatar--' + size">
      <img
        *ngIf="src && !brokenImage"
        [src]="src"
        [alt]="name"
        class="avatar__img"
        (error)="brokenImage = true"
      />
      <span *ngIf="!src || brokenImage" class="avatar__initials" aria-hidden="true">{{ initials }}</span>
    </div>
  `,
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() src: string | null | undefined;
  @Input() name = '';
  @Input() size: AvatarSize = 'md';

  /**
   * Se pone en `true` solo al fallar la carga de `src` (evento `error` de
   * `<img>`) — no es un @Input, es estado interno. Si `src` cambia después
   * (ej. el usuario sube un avatar nuevo), Angular recrea el `<img>` y esto
   * se reintenta solo.
   */
  brokenImage = false;

  get initials(): string {
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }
}
