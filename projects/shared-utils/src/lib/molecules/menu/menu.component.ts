import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface MenuItem {
  label: string;
  /** Nombre de ícono del registry (ver atoms/icon/icon-registry.ts). Opcional. */
  icon?: string;
  /** Pinta el item en rojo — para acciones destructivas (eliminar, remover). */
  danger?: boolean;
  disabled?: boolean;
  /** Dibuja un separador arriba de este item. */
  dividerBefore?: boolean;
  /** Se ejecuta al hacer click en el item; el menú se cierra automáticamente después. */
  action: () => void;
}

/**
 * Menú desplegable data-driven — reemplaza `<mat-menu>+matMenuTriggerFor+
 * mat-menu-item` (2 usos reales: admin-miembros "Opciones" de un miembro,
 * admin-grupos "Opciones" de un grupo). En vez de declarar el panel como
 * contenido fijo en el template, se pasa un array de `MenuItem` — cada fila
 * de una lista puede armar su propio menú con distintas acciones sin
 * duplicar el markup del panel.
 *
 * Sin overlay/CDK: popup posicionado con CSS (mismo criterio que Tooltip/
 * Datepicker). Cierra con Escape o con un `mousedown` fuera del componente —
 * NO con un capturador de clicks a pantalla completa, ver `onOutsidePointer`.
 *
 * Uso:
 *   <app-menu [items]="[
 *     { label: 'Editar', icon: 'edit', action: () => openEdit(g) },
 *     { label: 'Ver miembros', icon: 'people', action: () => goToDetalle(g) },
 *     { label: 'Eliminar', icon: 'delete_outline', danger: true, dividerBefore: true, action: () => openDelete(g) },
 *   ]">
 *     <button app-icon-button size="sm" aria-label="Opciones">
 *       <app-icon name="more_vert" />
 *     </button>
 *   </app-menu>
 *
 * El trigger proyectado abre/cierra el panel solo — el wrapper que lo
 * envuelve escucha el click, no hace falta un `(click)` en el botón.
 */
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  host: {
    '[class]': '"menu-host menu-host--" + align',
  },
})
export class MenuComponent implements OnDestroy {
  @Input({ required: true }) items: MenuItem[] = [];
  /** Alineación del panel respecto al trigger — 'end' (default) evita que se corte contra el borde derecho. */
  @Input() align: 'start' | 'end' = 'end';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  readonly isOpen = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  /**
   * Cierra al apretar fuera del componente.
   *
   * Antes esto lo hacía un `.menu-click-catcher` con
   * `position: fixed; inset: 0`, el mismo patrón que se sacó del Datepicker el
   * 2026-09-29 por dos motivos que también aplican acá:
   *
   * 1. Se traga el click. Con el menú abierto, 6 de los 9 elementos
   *    interactivos visibles de la pantalla quedaban inalcanzables —incluidos
   *    los links del sidebar—: el primer click solo cerraba el menú y había
   *    que volver a apretar.
   * 2. El capturador es hijo del componente, así que hereda la semántica de
   *    sus ancestros. Dentro de un `<label>` cualquier click de la página
   *    activa el label y el navegador lo reenvía al control asociado, que acá
   *    sería un botón del propio menú.
   *
   * En captura, para no depender de que nadie corte la propagación en el
   * medio; y `mousedown` en vez de `click` para cerrar antes de que el foco se
   * mueva, dejando que el click siga su curso hacia su destino real.
   */
  private readonly onOutsidePointer = (event: Event) => {
    const target = event.target as Node | null;
    if (target && this.host.nativeElement.contains(target)) return;
    this.zone.run(() => this.close());
  };

  private listenOutside(on: boolean): void {
    if (typeof document === 'undefined') return;
    document[on ? 'addEventListener' : 'removeEventListener'](
      'mousedown', this.onOutsidePointer, true,
    );
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    this.listenOutside(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.listenOutside(false);
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.listenOutside(false);
  }

  select(item: MenuItem): void {
    if (item.disabled) return;
    this.close();
    item.action();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
