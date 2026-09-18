import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ChipVariant = 'neutral' | 'brand';

/**
 * Pastilla con ícono+label, opcionalmente clickeable y/o removible — extraída
 * de user-profile/view (`.company-chip`, tinte de marca, no removible; y
 * `.social-chip`, neutro, clickeable + botón de eliminar con
 * `matChipRemove`), que reinventaban el mismo shape con clases locales y
 * `<mat-chip-set>/<mat-chip>` de Angular Material.
 *
 * Uso:
 *   <app-chip variant="brand">
 *     <app-icon name="account_circle" />
 *     <span>usuario123</span>
 *   </app-chip>
 *
 *   <app-chip [clickable]="true" [removable]="true" removeLabel="Eliminar LinkedIn"
 *             (click)="edit()" (remove)="delete()">
 *     <app-icon name="link" />
 *     <span>LinkedIn</span>
 *   </app-chip>
 */
@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <button
      *ngIf="removable"
      type="button"
      class="chip__remove"
      (click)="onRemoveClick($event)"
      [attr.aria-label]="removeLabel"
    >
      <app-icon name="cancel" size="14" />
    </button>
  `,
  styleUrl: './chip.component.scss',
  host: {
    '[class]': '"chip chip--" + variant',
    '[class.chip--clickable]': 'clickable',
  },
})
export class ChipComponent {
  @Input() variant: ChipVariant = 'neutral';
  @Input() clickable = false;
  @Input() removable = false;
  @Input() removeLabel = 'Eliminar';

  @Output() remove = new EventEmitter<void>();

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
