import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ─────────────────────────────────────────────────────────────────────────────
// Slot directives — importar junto con ExpansionPanelComponent en el consumidor
// ─────────────────────────────────────────────────────────────────────────────

/** Slot del encabezado (visible en todo momento). Admite cualquier contenido. */
@Directive({ selector: '[panel-header]', standalone: true })
export class PanelHeaderDirective {}

/** Slot del cuerpo (visible solo en estado expandido). */
@Directive({ selector: '[panel-content]', standalone: true })
export class PanelContentDirective {}

/** Slot del footer (opcional, visible solo en estado expandido). */
@Directive({ selector: '[panel-footer]', standalone: true })
export class PanelFooterDirective {}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────────────────────────────────────

export type PanelAttentionVariant = 'warning' | 'info';

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ## ExpansionPanelComponent
 *
 * Acordeón flexible con tres slots inyectables (`panel-header`, `panel-content`,
 * `panel-footer`), soporte completo de accesibilidad (WAI-ARIA 1.1) y estados
 * avanzados: loading (skeleton), disabled y attention-grabber.
 *
 * ### Uso mínimo
 * ```html
 * <app-expansion-panel>
 *   <div panel-header>Título del panel</div>
 *   <div panel-content>Contenido expandido</div>
 * </app-expansion-panel>
 * ```
 *
 * ### Con footer + attention-grabber
 * ```html
 * <app-expansion-panel [attention]="true" attentionVariant="warning">
 *   <div panel-header>Facturas pendientes <app-badge [count]="3"/></div>
 *   <div panel-content><app-tabla-facturas/></div>
 *   <div panel-footer>
 *     <button app-button>Ver todas</button>
 *   </div>
 * </app-expansion-panel>
 * ```
 */
@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent implements AfterContentInit, OnChanges {

  // ── Inputs ────────────────────────────────────────────────────────────────

  /** Controla el estado expandido/contraído. Permite uso two-way con `[(expanded)]`. */
  @Input() expanded = false;

  /** Deshabilita interacción de usuario y aplica estilos de estado `disabled`. */
  @Input() disabled = false;

  /**
   * Muestra el skeleton loading mientras es `true`.
   * Oculta el contenido real y anima el borde giratorio (igual que `app-card`).
   */
  @Input() loading = false;

  /**
   * Dispara la microinteracción "attention-grabber".
   * Al pasar de `false` a `true`, ejecuta la animación una sola vez.
   * Volver a `false` y a `true` la re-dispara.
   */
  @Input() attention = false;

  /**
   * Color del destello perimetral del attention-grabber.
   * - `'warning'` → `--color-warning` (#F59E0B)
   * - `'info'`    → `--color-info`    (#3B82F6)
   */
  @Input() attentionVariant: PanelAttentionVariant = 'warning';

  /**
   * Texto alternativo para el botón chevron (accesibilidad).
   * Si no se provee, se genera automáticamente ("Expandir" / "Contraer").
   */
  @Input() ariaLabel?: string;

  /** Id único para vincular header y region via aria-controls / aria-labelledby. */
  @Input() panelId = `ep-${Math.random().toString(36).slice(2, 8)}`;

  // ── Outputs ───────────────────────────────────────────────────────────────

  /** Emite el nuevo valor de `expanded` al cambiar. Permite `[(expanded)]`. */
  @Output() expandedChange = new EventEmitter<boolean>();

  /** Emite cada vez que el panel termina de abrir o cerrar. */
  @Output() toggled = new EventEmitter<boolean>();

  // ── ContentChildren ───────────────────────────────────────────────────────

  @ContentChild(PanelHeaderDirective) private _headerSlot?: PanelHeaderDirective;
  @ContentChild(PanelFooterDirective) private _footerSlot?: PanelFooterDirective;

  // ── Estado interno ────────────────────────────────────────────────────────

  /** Activa la clase CSS de attention-grabber. Se auto-limpia al terminar la animación. */
  _attentionActive = false;

  private cdr = inject(ChangeDetectorRef);

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterContentInit(): void {
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attention'] && this.attention && !this.disabled) {
      this._triggerAttention();
    }
  }

  // ── Getters / computed ────────────────────────────────────────────────────

  get hasHeader(): boolean { return !!this._headerSlot; }
  get hasFooter(): boolean { return !!this._footerSlot; }

  get chevronLabel(): string {
    if (this.ariaLabel) return this.ariaLabel;
    return this.expanded ? 'Contraer panel' : 'Expandir panel';
  }

  get headerId(): string { return `${this.panelId}-header`; }
  get regionId(): string { return `${this.panelId}-region`; }

  // ── Acciones ──────────────────────────────────────────────────────────────

  toggle(): void {
    if (this.disabled || this.loading) return;
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
    this.toggled.emit(this.expanded);
    this.cdr.markForCheck();
  }

  // ── Attention-grabber ─────────────────────────────────────────────────────

  private _triggerAttention(): void {
    // Asegurar que la clase se resetea antes de re-aplicar (permite re-trigger)
    this._attentionActive = false;
    this.cdr.markForCheck();
    // Un frame de pausa antes de activar para forzar re-render
    requestAnimationFrame(() => {
      this._attentionActive = true;
      this.cdr.markForCheck();
    });
  }

  /** Llamado por el evento `animationend` del host CSS. Limpia la clase. */
  onAttentionEnd(): void {
    this._attentionActive = false;
    this.cdr.markForCheck();
  }
}
