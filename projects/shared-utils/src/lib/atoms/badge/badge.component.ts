import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Variantes semánticas. Cubren los 8 casos reales que hoy viven duplicados
 * a mano como `.rol-chip--admin/operador/colaborador/auditor` y
 * `.badge--pending/approved/rejected/expired` en
 * seis-mfe-gestion-usuario/organization/org-gestor/_admin-shared.scss.
 */
export type BadgeVariant =
  | 'success'   // approved
  | 'warning'   // pending
  | 'error'     // rejected
  | 'info'      // operador
  | 'brand'     // colaborador
  | 'neutral';  // expired / default

/**
 * Pill de estado/rol — reemplaza los `.rol-chip`/`.badge` reinventados a mano
 * en org-gestor, ofertador-facturas, dashboard-facturas, navbar, etc. (13+
 * usos encontrados en la auditoría de estilos, todos con el mismo shape:
 * inline-flex, padding 3px 10px, radius pill, texto uppercase).
 *
 * Uso:
 *   <app-badge variant="success">Aprobado</app-badge>
 *
 * `color` es una escapatoria para casos sin token de estado propio (ej. el
 * rol "auditor" en org-gestor usaba violeta `#A78BFA`, que no es un color de
 * estado semántico — es una convención de color por rol, decisión de
 * producto). Acepta cualquier color CSS válido y pisa el `variant`.
 *   <app-badge color="#A78BFA">Auditor</app-badge>
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="'badge--' + variant" [style.--badge-color]="color">
      <ng-content />
    </span>
  `,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() color: string | null = null;
}
