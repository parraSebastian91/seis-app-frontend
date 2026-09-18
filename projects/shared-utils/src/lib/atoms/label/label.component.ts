import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Wrapper `<label>` — generaliza el patrón repetido en
 * modal-publicacion-factura/atomic-factura-filters:
 *   <label><span>Deudor</span><input ...></label>
 * (display:flex column, gap .35rem, texto .82rem/600 — igual en los 2 sitios,
 * cada uno con su propia regla CSS).
 *
 * Uso:
 *   <app-label text="RUT Deudor" required>
 *     <input type="text" [(ngModel)]="form.rut" />
 *   </app-label>
 */
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="app-label">
      <span class="app-label__text">{{ text }}<span *ngIf="required" class="app-label__required" aria-hidden="true"> *</span></span>
      <ng-content />
    </label>
  `,
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  @Input() text = '';
  @Input() required = false;
}
