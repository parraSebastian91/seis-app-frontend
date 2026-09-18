import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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
 * Datepicker), con click-catcher para cerrar al hacer click afuera y Escape.
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
export class MenuComponent {
  @Input({ required: true }) items: MenuItem[] = [];
  /** Alineación del panel respecto al trigger — 'end' (default) evita que se corte contra el borde derecho. */
  @Input() align: 'start' | 'end' = 'end';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.closed.emit();
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
