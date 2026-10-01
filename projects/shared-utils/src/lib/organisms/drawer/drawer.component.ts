import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EnvironmentInjector,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { DrawerService } from '../../services/drawer/drawer.service';

/**
 * Shell genérico del Drawer — el host que renderiza lo que abre `DrawerService`.
 *
 * Vive acá y no en `seis-portal` porque `DrawerService` es un singleton de
 * `shared-utils` que cualquier MFE puede llamar, pero el servicio solo setea una
 * señal: sin un host montado, `open()` no muestra nada y falla en silencio. Con
 * el componente en la librería, cada MFE puede montar el suyo y seguir
 * funcionando standalone, no solo dentro del shell.
 *
 * Basta con un `<app-drawer />` en el componente raíz de la app.
 *
 *
 * Desktop (≥ 700px) → panel lateral desde la derecha.
 * Mobile  (< 700px) → bottom sheet emergente desde abajo.
 *
 * Animaciones: slide-in al abrir, slide-out al cerrar (300ms ease).
 * Tokens: usa --color-bg-surface, --color-text-primary, --color-border del design system.
 */
@Component({
  selector: 'app-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnDestroy {
  readonly drawerService = inject(DrawerService);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly cdr = inject(ChangeDetectorRef);

  /** true mientras el panel está en el DOM (incluye animación de salida) */
  readonly visible = signal(false);
  /** true durante la animación de cierre */
  readonly closing = signal(false);
  readonly isMobile = signal(false);

  private _outlet?: ViewContainerRef;
  private _componentRef?: ComponentRef<unknown>;
  private _closeTimer?: ReturnType<typeof setTimeout>;

  @ViewChild('outlet', { read: ViewContainerRef })
  set outlet(vcr: ViewContainerRef | undefined) {
    this._outlet = vcr;
    if (vcr && this.drawerService.config()) {
      this.mountComponent(vcr);
    }
  }

  constructor() {
    this.updateMobile();

    effect(() => {
      const config = this.drawerService.config();
      if (config) {
        // Cancelar cierre pendiente si se abre inmediatamente
        if (this._closeTimer) clearTimeout(this._closeTimer);
        this.closing.set(false);
        this.visible.set(true);
        if (this._outlet) this.mountComponent(this._outlet);
      } else {
        // null → solo cuando viene de close() interno: ya se maneja en requestClose()
      }
      this.cdr.markForCheck();
    });
  }

  /** Cierra con animación de salida antes de destruir el componente. */
  requestClose(): void {
    if (this.closing()) return;
    this.closing.set(true);
    this.cdr.markForCheck();
    this._closeTimer = setTimeout(() => {
      this.visible.set(false);
      this.closing.set(false);
      this._componentRef?.destroy();
      this._componentRef = undefined;
      this.drawerService.close();
      this.cdr.markForCheck();
    }, 300); // igual que --_duration
  }

  private mountComponent(vcr: ViewContainerRef): void {
    const config = this.drawerService.config();
    if (!config) return;

    this._componentRef?.destroy();
    vcr.clear();

    this._componentRef = vcr.createComponent(config.component, {
      environmentInjector: this.envInjector,
    });

    const instance = this._componentRef.instance as Record<string, unknown>;
    instance['drawerInputs'] = config.inputs;
    this._componentRef.changeDetectorRef.detectChanges();
  }

  @HostListener('window:resize')
  updateMobile(): void {
    this.isMobile.set(window.innerWidth < 700);
    this.cdr.markForCheck();
  }

  /**
   * Overlays que manejan su propio Escape y que, estando abiertos, deben
   * quedarse con la tecla.
   *
   * Sin esto, abrir el calendario de un datepicker dentro del drawer y apretar
   * Escape cerraba el panel ENTERO, perdiendo lo que el usuario venía cargando:
   * los dos escuchan `document:keydown.escape` y ambos handlers corren.
   * `stopPropagation` no sirve —son listeners sobre el mismo nodo— y
   * `stopImmediatePropagation` dependería del orden de registro, que acá es el
   * contrario al que haría falta: el drawer se crea antes que su contenido.
   */
  private static readonly OVERLAYS_INTERNOS =
    '.datepicker__panel, .datepicker__sheet, .modal-backdrop';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.visible()) return;
    if (document.querySelector(DrawerComponent.OVERLAYS_INTERNOS)) return;
    this.requestClose();
  }

  ngOnDestroy(): void {
    this._componentRef?.destroy();
    if (this._closeTimer) clearTimeout(this._closeTimer);
  }
}


