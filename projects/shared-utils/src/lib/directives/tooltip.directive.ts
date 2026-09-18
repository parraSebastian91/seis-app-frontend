import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, inject } from '@angular/core';

/**
 * Tooltip flotante sin overlay/CDK — reemplaza `matTooltip` (9 usos reales:
 * admin-solicitudes, user-profile/view, org-profile). Todos son strings
 * estáticos cortos ("Copiar token", "Editar dirección", "Próximamente") sin
 * contenido rico ni necesidad de reposicionamiento inteligente — un `<div>`
 * posicionado con `getBoundingClientRect()` alcanza, sin traer Angular CDK
 * Overlay como dependencia nueva.
 *
 * Nota conocida (mismo límite documentado por Material): un botón con
 * `disabled` nativo no dispara `mouseenter` en Chrome, así que el tooltip no
 * se muestra ahí salvo que se envuelva en un elemento no deshabilitado.
 *
 * Uso:
 *   <button appTooltip="Copiar token" (click)="copy()"><app-icon name="content_copy" /></button>
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';
  @Input() tooltipPosition: 'top' | 'bottom' = 'top';

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private bubble: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  @HostListener('focus')
  onShow(): void {
    if (!this.text || this.bubble) return;
    this.showTimer = setTimeout(() => this.render(), 300);
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('click')
  onHide(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.destroyBubble();
  }

  ngOnDestroy(): void {
    this.onHide();
  }

  private render(): void {
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();

    const bubble = this.renderer.createElement('div') as HTMLElement;
    this.renderer.appendChild(bubble, this.renderer.createText(this.text));
    this.renderer.setAttribute(bubble, 'role', 'tooltip');
    for (const [prop, value] of Object.entries({
      position: 'fixed',
      'z-index': '10000',
      padding: '4px 8px',
      'border-radius': 'var(--radius-sm, 6px)',
      background: 'var(--color-bg-elevated, #1E2A8A)',
      color: 'var(--color-text-primary, #fff)',
      border: '1px solid var(--color-border, rgba(255,255,255,.12))',
      'font-size': '.75rem',
      'font-family': 'var(--font-sans, sans-serif)',
      'white-space': 'nowrap',
      'pointer-events': 'none',
      'box-shadow': '0 4px 12px rgba(0,0,0,.25)',
    })) {
      this.renderer.setStyle(bubble, prop, value);
    }
    this.renderer.appendChild(document.body, bubble);

    const bubbleRect = bubble.getBoundingClientRect();
    const top =
      this.tooltipPosition === 'top'
        ? rect.top - bubbleRect.height - 8
        : rect.bottom + 8;
    const left = rect.left + rect.width / 2 - bubbleRect.width / 2;

    this.renderer.setStyle(bubble, 'top', `${Math.max(4, top)}px`);
    this.renderer.setStyle(bubble, 'left', `${Math.max(4, left)}px`);

    this.bubble = bubble;
  }

  private destroyBubble(): void {
    if (this.bubble) {
      this.renderer.removeChild(document.body, this.bubble);
      this.bubble = null;
    }
  }
}
