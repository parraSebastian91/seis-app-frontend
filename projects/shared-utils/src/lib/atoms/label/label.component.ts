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
 *
 * `grupo` para cuando el slot tiene MÁS de un control. Un `<label>` reenvía
 * cualquier click de su interior a su primer control enfocable, así que con dos
 * controles adentro el segundo deja de ser clickeable: clickear un chip de
 * plazo abría el calendario del datepicker vecino (drawer de publicación,
 * 2026-10-01). Con `grupo` el contenedor es un `<div role="group">` y el texto
 * un `<span>`, sin asociación implícita.
 */
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #cuerpo>
      <span class="app-label__text">{{ text }}<span *ngIf="required" class="app-label__required" aria-hidden="true"> *</span></span>
      <ng-content />
    </ng-template>

    @if (grupo) {
      <div class="app-label" role="group" [attr.aria-label]="text">
        <ng-container [ngTemplateOutlet]="cuerpo" />
      </div>
    } @else {
      <label class="app-label">
        <ng-container [ngTemplateOutlet]="cuerpo" />
      </label>
    }
  `,
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  @Input() text = '';
  @Input() required = false;
  /** El slot trae más de un control: sin `<label>`, para no robarle los clicks. */
  @Input() grupo = false;
}
