import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Slide-toggle — extrae el patrón `.toggle-switch`/`.toggle-input`/
 * `.toggle-track`/`.toggle-thumb` que ya existía, bien hecho, en
 * org-wizard.component.html/.scss (usado 6 VECES ahí — notificaciones,
 * "opera en otras regiones", "firma digital" — todas con `formControlName`),
 * en vez de traer `MatSlideToggle`.
 *
 * Uso:
 *   <app-slide-toggle formControlName="notifEmail">Email</app-slide-toggle>
 */
@Component({
  selector: 'app-slide-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="toggle-row" [class.toggle-row--disabled]="disabled">
      <span class="toggle-switch">
        <input
          type="checkbox"
          class="toggle-input"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onChange($event)"
          (blur)="onTouched()"
        />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </span>
      <span class="toggle-label"><ng-content /></span>
    </label>
  `,
  styleUrl: './slide-toggle.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SlideToggleComponent),
      multi: true,
    },
  ],
})
export class SlideToggleComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private onChangeFn: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    this.checked = value;
    this.onChangeFn(value);
    this.checkedChange.emit(value);
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
