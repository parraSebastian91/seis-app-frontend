import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Spinner circular — reemplaza `<mat-spinner>` (33 usos encontrados en el
 * workspace, mayormente dos tamaños: 16-18px inline en botones vía
 * `.btn-spinner`, y 32-52px como loader de sección/página completa).
 * SVG puro con animación CSS, sin @angular/material.
 *
 * El color hereda de `currentColor` por defecto — así funciona bien tanto
 * suelto (color de texto normal) como dentro de un botón (toma el color del
 * texto del botón, sea blanco sobre fondo primario o brand sobre fondo claro).
 *
 * Uso:
 *   <app-loader />                          <!-- 24px, currentColor -->
 *   <app-loader [size]="18" />              <!-- inline en un botón -->
 *   <app-loader [size]="48" color="var(--color-brand-primary)" />
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="loader"
      [attr.width]="size"
      [attr.height]="size"
      [style.color]="color"
      viewBox="0 0 50 50"
      role="status"
      [attr.aria-label]="label"
    >
      <circle class="loader__track" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
      <circle class="loader__arc" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
    </svg>
  `,
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  @Input() size: number = 24;
  /** Color CSS explícito. Sin setear, hereda `currentColor` del contexto. */
  @Input() color: string | null = null;
  @Input() label = 'Cargando…';
}
