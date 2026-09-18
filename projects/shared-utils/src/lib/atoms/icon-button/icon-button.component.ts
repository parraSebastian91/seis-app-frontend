import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Botón circular solo-ícono — generaliza `.btn-close`/`.tnc-close`
 * (modal-publicacion-factura, terms-and-conditions-modal): mismo shape
 * (círculo, background sutil, hover más oscuro) reinventado por archivo.
 *
 * Uso:
 *   <button app-icon-button aria-label="Cerrar" (click)="close()">
 *     <app-icon name="close" />
 *   </button>
 */
export type IconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[app-icon-button]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './icon-button.component.scss',
  host: {
    '[class]': '"icon-btn icon-btn--" + size',
  },
})
export class IconButtonComponent {
  /**
   * sm = 1.75rem (headers compactos, sufijos de input), md = 2rem (default,
   * tamaño real de .btn-close), lg = 2.5rem (equivalente a mat-mini-fab,
   * usado en fabs flotantes sobre banner/avatar — ver user-profile).
   */
  @Input() size: IconButtonSize = 'md';
}
