import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface CardColaboradorData {
  /** Identificador único del colaborador */
  id: string | number;
  nombre: string;
  apellido: string;
  /** URL del avatar — si es null/undefined se muestran las iniciales */
  avatarUrl?: string | null;
  /** Cargo / rol dentro de la organización */
  cargo?: string | null;
  /** Nombre del grupo al que pertenece */
  grupoNombre?: string | null;
  /** Username utilizado para navegar al perfil */
  username?: string | null;
}

@Component({
  selector: 'app-card-colaborador',
  templateUrl: './card-colaborador.component.html',
  styleUrl: './card-colaborador.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardColaboradorComponent {
  /** Datos del colaborador a mostrar */
  @Input({ required: true }) colaborador!: CardColaboradorData;

  /** Emite cuando el usuario hace click o presiona Enter en la tarjeta */
  @Output() cardClick = new EventEmitter<CardColaboradorData>();

  onSelect(): void {
    this.cardClick.emit(this.colaborador);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }
}
