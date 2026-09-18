import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Checkbox — extrae el patrón `.checkbox-row`/`.checkbox-input`/`.checkbox-box`
 * que ya existía, bien hecho, en org-wizard.component.html/.scss (usado 3
 * veces ahí, con `formControlName`), en vez de traer `MatCheckbox` (que
 * estaba importado en organization.module.ts pero — se descubrió acá — sin
 * un solo `<mat-checkbox>` real en ningún template: import muerto).
 *
 * Funciona con [(ngModel)]/formControlName (ControlValueAccessor) — para el
 * caso sin forms reactivos (ver factura-detalle, [checked]+(change) directo),
 * usar [checked]+(checkedChange).
 *
 * Uso:
 *   <app-checkbox formControlName="esPrincipal">Marcar como dirección principal</app-checkbox>
 *   <app-checkbox [checked]="isSelected" (checkedChange)="toggle()">Comparar</app-checkbox>
 */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="checkbox-row" [class.checkbox-row--disabled]="disabled">
      <input
        type="checkbox"
        class="checkbox-input"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="checkbox-box"></span>
      <span class="checkbox-label"><ng-content /></span>
    </label>
  `,
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
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
