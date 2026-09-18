import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

/**
 * Placeholder de carga (shimmer) — reemplaza las implementaciones ad-hoc
 * duplicadas en:
 *   - shared-utils/molecules/card (.card__skeleton-bar + @keyframes skeleton-wave)
 *   - kpi-card / pipeline-summary (dashboard-facturas): .skeleton + @keyframes pulse
 *   - cartera-activa-summary / my-offers-table (dashboard-facturas): .skel + @keyframes shimmer
 *   - kpis-factura-header (ofertador-facturas): .skeleton + @keyframes shimmer (con colores
 *     claros hardcodeados, no seguía el tema navy del resto de la app)
 *
 * Un solo átomo, N composiciones: cada molécula/organismo con estado `loading`
 * arma su propio layout combinando instancias con distinto `width`/`height`,
 * igual que ya hacía Card con sus variantes --title/--subtitle/--md/--sm/--btn.
 *
 * Uso:
 *   <app-skeleton />                                  <!-- línea de texto, 100% -->
 *   <app-skeleton width="55%" height="22px" />        <!-- título -->
 *   <app-skeleton variant="circle" width="40px" height="40px" />
 *   <app-skeleton variant="rect" height="110px" />
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.component.scss',
  host: {
    class: 'skeleton',
    '[class.skeleton--text]': "variant === 'text'",
    '[class.skeleton--rect]': "variant === 'rect'",
    '[class.skeleton--circle]': "variant === 'circle'",
    '[style.width]': 'widthPx',
    '[style.height]': 'heightPx',
    '[style.borderRadius]': 'radiusPx',
    'aria-hidden': 'true',
  },
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() width: string | number = '100%';
  @Input() height: string | number | null = null;
  /** Sobrescribe el radio por defecto de la variante (6px texto, --radius-sm rect, 50% circle). */
  @Input() radius: string | number | null = null;

  get widthPx(): string {
    return this.toCssSize(this.width);
  }

  get heightPx(): string {
    if (this.height !== null) return this.toCssSize(this.height);
    return this.variant === 'text' ? '14px' : '100%';
  }

  get radiusPx(): string | null {
    if (this.radius !== null) return this.toCssSize(this.radius);
    return null; // deja que el SCSS aplique el default por variante
  }

  private toCssSize(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }
}
