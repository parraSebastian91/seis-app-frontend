import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

/**
 * Select nativo estilizado — reemplaza `<mat-select>+<mat-option>` de
 * Angular Material (5 usos reales: user-profile/view, org-profile,
 * admin-solicitudes, admin-miembros, admin-grupos). Ninguno de esos usos
 * necesita búsqueda ni multi-selección — eso queda para el futuro átomo de
 * "combo box checkeable + búsqueda"; acá es un `<select>` nativo con las
 * `<option>` proyectadas tal cual, igual que `InputComponent` envuelve un
 * `<input>` nativo.
 *
 * Implementa ControlValueAccessor: funciona con [(ngModel)] o formControlName.
 *
 * Uso:
 *   <app-select formControlName="tipo">
 *     <option *ngFor="let t of tipos" [value]="t">{{ t }}</option>
 *   </app-select>
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-select-wrap">
      <select
        class="app-select"
        [class.app-select--error]="hasError"
        [disabled]="disabled"
        [ngModel]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      >
        <ng-content></ng-content>
      </select>
      <app-icon name="expand_more" size="18" class="app-select__chevron" />
    </div>
  `,
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() hasError = false;
  disabled = false;

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
