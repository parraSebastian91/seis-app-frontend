import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CardOrganizacionData {
  razon_social: string;
  avatarUrl?: string | null;
  rut: string;
  totalFacturas: string | number;
}

@Component({
  selector: 'lib-card-organizacion',
  imports: [],
  templateUrl: './card-organizacion.component.html',
  styleUrl: './card-organizacion.component.scss',
})
export class CardOrganizacionComponent {
  @Input({ required: true }) organizacion!: CardOrganizacionData;
  @Output() cardClick = new EventEmitter<CardOrganizacionData>();

  onSelect(): void {
    this.cardClick.emit(this.organizacion);
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
