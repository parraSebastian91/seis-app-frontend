import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 4 variantes reales encontradas en `.btn-primary/secondary/light/danger`
 * (modal-publicacion-factura.component.scss, terms-and-conditions-modal —
 * ahí como `.btn-aceptar`/`.btn-revisar`) — mismo shape, mismos 4 roles,
 * reinventados por archivo con su propio set de variables `--modal-*`
 * locales en vez de los tokens compartidos.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'danger';

/**
 * Uso:
 *   <button app-button variant="primary" [disabled]="isSubmitting">Guardar</button>
 *   <button app-button variant="light" (click)="cancel()">Cancelar</button>
 *
 * Es un `[app-button]` como atributo (no selector de elemento) para poder
 * seguir usando `<button type="submit">` nativo — necesario dentro de forms
 * (ver modal-publicacion-factura) sin perder la semántica de submit/reset.
 */
@Component({
  selector: 'button[app-button]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './button.component.scss',
  host: {
    '[class]': '"btn btn--" + variant',
  },
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
}
