import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalTitleDirective, ModalActionsDirective } from '../modal/modal.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

/**
 * Diálogo de confirmación — compone `app-modal` en vez de reinventar el shell.
 *
 * Los tres modales de confirmación del sistema (offer-retire-confirm-dialog
 * en dashboard-facturas, modal-confirmacion-oferta en ofertador,
 * terms-and-conditions-modal en publicador) repetían la misma estructura:
 * backdrop + panel + header + body + footer con Cancelar/Confirmar, estado
 * de carga con label alternativo y, en dos de los tres, un bloque de error.
 * Cada uno con sus propios colores hardcodeados.
 *
 * El cuerpo admite las dos formas: `message` para el caso simple (una línea)
 * y proyección de contenido para los casos con detalle de dominio. Se pueden
 * combinar; lo proyectado se renderiza antes que `message`.
 *
 * Mientras `loading` está activo no se puede cancelar ni cerrar por backdrop
 * o Escape: una operación en vuelo no debe quedar huérfana.
 *
 * Uso:
 *   <app-confirm-dialog [open]="abierto" title="¿Retirar oferta?"
 *     message="Esta acción no se puede deshacer." confirmLabel="Sí, retirar"
 *     [danger]="true" [loading]="cargando"
 *     (confirmed)="retirar()" (cancelled)="abierto = false" />
 *
 *   <app-confirm-dialog [open]="mostrar" title="¿Confirmar oferta firme?"
 *     confirmLabel="Sí, publicar oferta" [loading]="cargando" [error]="error"
 *     (confirmed)="confirmar()" (cancelled)="cancelar()">
 *     <p>Vas a transferir …</p>
 *   </app-confirm-dialog>
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ModalTitleDirective,
    ModalActionsDirective,
    ButtonComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = '¿Confirmar?';
  /** Cuerpo simple. Se ignora si se proyecta contenido. */
  @Input() message = '';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() loadingLabel = 'Procesando…';
  @Input() loading = false;
  /** Pinta la acción principal como destructiva. */
  @Input() danger = false;
  @Input() error: string | null = null;
  @Input() maxWidth = '440px';

  @Output() readonly confirmed = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();

  onConfirm(): void {
    if (this.loading) return;
    this.confirmed.emit();
  }

  onCancel(): void {
    if (this.loading) return;
    this.cancelled.emit();
  }
}
