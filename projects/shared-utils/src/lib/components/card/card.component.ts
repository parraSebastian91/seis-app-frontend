import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/** Marca el slot del título. Importar en el componente consumidor junto a CardComponent. */
@Directive({ selector: '[card-title]', standalone: true })
export class CardTitleDirective { }

/** Marca el slot del footer. Importar en el componente consumidor junto a CardComponent. */
@Directive({ selector: '[card-footer]', standalone: true })
export class CardFooterDirective { }

/**
 <!-- con header + footer -->
<app-card>
  <div card-title><h3>Título</h3></div>
  <div card-content>Contenido</div>
  <div card-footer><button>Aceptar</button></div>
</app-card>

<!-- sin header ni footer → body ocupa toda la card -->
<app-card>
  <div card-content>Solo contenido expandido</div>
</app-card>
 */

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements AfterContentInit {
  @Input() loading = false;
  @Input() elevated = true;
  @Input() hoverLift = false;

  @Input() width = 'auto';
  @Input() height = 'auto';
  @Input() radius = '16px';
  /**
   * Padding de las secciones (header, body, footer).
   * - `'default'` → usa los paddings del design system (18px 20px / 16px 20px / 12px 20px)
   * - `'none'` o `'0'` → sin padding en todas las secciones
   * - Cualquier valor CSS válido → se aplica como padding uniforme (ej. `'8px 16px'`)
   */
  @Input() padding: string = 'default';

  /** Permite usar token del sistema de diseño, hex o color CSS válido. */
  @Input() glowColor = 'var(--color-brand-primary, #00BFA5)';

  @ContentChild(CardTitleDirective) private _titleSlot?: CardTitleDirective;
  @ContentChild(CardFooterDirective) private _footerSlot?: CardFooterDirective;

  private cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    // Necesario para OnPush: forzar re-evaluación tras resolver los slots
    this.cdr.markForCheck();
  }

  get hasTitle(): boolean {
    return !!this._titleSlot;
  }

  get hasFooter(): boolean {
    return !!this._footerSlot;
  }

  get cardStyles(): Record<string, string> {
    const styles: Record<string, string> = {
      '--card-width': this.width,
      '--card-height': this.height,
      '--card-radius': this.radius,
      '--card-glow-color': this.glowColor,
    };
    if (this.padding === 'default') {
      styles['--card-padding'] = '18px 20px 14px'; // valores por defecto del design system
    } else {
      styles['--card-padding'] = this.padding === 'none' ? '0' : this.padding;
    }
    return styles;
  }
}