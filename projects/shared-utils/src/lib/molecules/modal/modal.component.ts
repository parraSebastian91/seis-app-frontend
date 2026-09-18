import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

/** Marca el slot del título. Opcional — sin él no se renderiza el header. */
@Directive({ selector: '[modal-title]', standalone: true })
export class ModalTitleDirective { }

/** Marca el slot de acciones (botones del footer). Opcional. */
@Directive({ selector: '[modal-actions]', standalone: true })
export class ModalActionsDirective { }

/**
 * Modal genérico — reemplaza el patrón `.modal-backdrop`/`.modal-panel`
 * reinventado a mano en 9 archivos (org-gestor ×4, modal-upload-object,
 * modal-publicacion-factura, etc. — ver auditoría de estilos). Todos
 * compartían el mismo shape: backdrop fijo + click-fuera-para-cerrar + panel
 * centrado con header/body/footer.
 *
 * Uso:
 *   <app-modal [open]="isOpen()" (closed)="isOpen.set(false)">
 *     <div modal-title>Confirmar acción</div>
 *     <p>Contenido del body (proyección por defecto).</p>
 *     <div modal-actions>
 *       <button (click)="isOpen.set(false)">Cancelar</button>
 *       <button (click)="confirm()">Confirmar</button>
 *     </div>
 *   </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() open = false;
  /** Ancho máximo del panel. Ej: '440px' (default, tamaño de confirmación) o '720px' (formularios). */
  @Input() maxWidth = '440px';
  @Output() closed = new EventEmitter<void>();

  @ContentChild(ModalTitleDirective) private _titleSlot?: ModalTitleDirective;
  @ContentChild(ModalActionsDirective) private _actionsSlot?: ModalActionsDirective;

  get hasTitle(): boolean {
    return !!this._titleSlot;
  }

  get hasActions(): boolean {
    return !!this._actionsSlot;
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }
}
