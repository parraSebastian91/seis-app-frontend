import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() loading = false;
  @Input() elevated = true;
  @Input() hoverLift = false;

  @Input() width = '300px';
  @Input() height = 'auto';
  @Input() radius = '16px';

  /** Permite usar token del sistema de diseño, hex o color CSS válido. */
  @Input() glowColor = 'var(--color-brand-primary, #00BFA5)';

  get cardStyles(): Record<string, string> {
    return {
      '--card-width': this.width,
      '--card-height': this.height,
      '--card-radius': this.radius,
      '--card-glow-color': this.glowColor,
    };
  }
}