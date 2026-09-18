import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';

export interface CardOrganizacionData {
  razon_social: string;
  avatarUrl?: string | null;
  rut: string;
  totalFacturas: string | number;
}

@Component({
  selector: 'lib-card-organizacion',
  imports: [AvatarComponent, BadgeComponent],
  templateUrl: './card-organizacion.component.html',
  styleUrl: './card-organizacion.component.scss',
})
export class CardOrganizacionComponent {
  @Input({ required: true }) organizacion!: CardOrganizacionData;
  @Output() cardClick = new EventEmitter<CardOrganizacionData>();

  onSelect(): void {
    this.cardClick.emit(this.organizacion);
  }
}
