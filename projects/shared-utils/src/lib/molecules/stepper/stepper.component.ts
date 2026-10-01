import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

/** Un paso del asistente. */
export interface PasoStepper {
  /** Lo que se lee debajo del número. */
  readonly etiqueta: string;
  /** `false` bloquea saltar a ese paso. Útil para no adelantarse sin datos. */
  readonly habilitado?: boolean;
}

/**
 * Indicador de progreso de un asistente de varios pasos.
 *
 * Presentacional: no sabe de validación ni de navegación: recibe en qué paso
 * está y avisa cuándo alguien pide ir a otro. Quién decide si ese salto se
 * permite es el componente que lo usa.
 *
 * Vive en la librería porque es el segundo consumidor —el wizard modal de
 * publicación tenía el suyo en SCSS local— y reimplementar shells es justo lo
 * que la auditoría del design system viene sacando.
 *
 * Uso:
 *   <app-stepper [pasos]="pasos" [actual]="paso()" (irA)="paso.set($event)" />
 */
@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  @Input({ required: true }) pasos: readonly PasoStepper[] = [];
  /** Índice del paso actual, base 0. */
  @Input() actual = 0;
  /** Etiqueta accesible del conjunto. */
  @Input() ariaLabel = 'Progreso del asistente';

  /** Pide ir a un paso. El caller decide si lo permite. */
  @Output() readonly irA = new EventEmitter<number>();

  alHacerClick(indice: number): void {
    // Hacia adelante solo si el paso está habilitado; hacia atrás, siempre:
    // volver a revisar lo que uno ya hizo no debería requerir permiso.
    if (indice > this.actual && this.pasos[indice]?.habilitado === false) return;
    if (indice !== this.actual) this.irA.emit(indice);
  }

  estado(indice: number): 'hecho' | 'actual' | 'pendiente' {
    if (indice < this.actual) return 'hecho';
    return indice === this.actual ? 'actual' : 'pendiente';
  }

  esAlcanzable(indice: number): boolean {
    return indice <= this.actual || this.pasos[indice]?.habilitado !== false;
  }
}
