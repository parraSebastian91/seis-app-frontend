import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  forwardRef,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Marca un control (típicamente `app-icon-button`) proyectado dentro del input — mismo rol que `matSuffix`. */
@Directive({ selector: '[input-suffix]', standalone: true })
export class InputSuffixDirective {}

/**
 * Input de texto — generaliza el `input,select { height: 2.3rem; border: 1px
 * solid var(--color-border); ... }` de atomic-factura-filters.component.scss
 * (era el único de los 13 `<input>` de esta carpeta que ya usaba tokens; el
 * resto — factura-view, modal-publicacion-factura — hardcodeaba sus propios
 * estilos o vivía de variables `--modal-*` locales).
 *
 * Implementa ControlValueAccessor: funciona con [(ngModel)] o formControlName
 * igual que un <input> nativo.
 *
 * El slot `[input-suffix]` reemplaza el botón de mostrar/ocultar contraseña
 * duplicado en user-profile/view (`matSuffix mat-icon-button`) y app-login/
 * credentials-step (posicionamiento CSS propio, sin Material) — mismo botón,
 * dos implementaciones distintas.
 *
 * Uso:
 *   <app-input [(ngModel)]="form.rutDeudor" placeholder="12.345.678-9" />
 *   <app-input type="number" [hasError]="!isValid" />
 *   <app-input type="password" formControlName="password">
 *     <button input-suffix app-icon-button size="sm" type="button" (click)="toggle()">
 *       <app-icon [name]="visible ? 'visibility_off' : 'visibility'" />
 *     </button>
 *   </app-input>
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-input-wrap">
      <input
        class="app-input"
        [class.app-input--error]="hasError"
        [class.app-input--has-suffix]="hasSuffix"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.inputmode]="inputmode"
        [attr.autocomplete]="autocomplete"
        [ngModel]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      />
      <div class="app-input__suffix" [class.is-empty]="!hasSuffix">
        <ng-content select="[input-suffix]"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, AfterContentInit {
  @Input() type: 'text' | 'number' | 'email' | 'tel' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() hasError = false;
  @Input() inputmode: string | null = null;
  @Input() autocomplete: string | null = null;
  disabled = false;

  @ContentChild(InputSuffixDirective) private _suffixSlot?: InputSuffixDirective;
  private readonly cdr = inject(ChangeDetectorRef);

  get hasSuffix(): boolean {
    return !!this._suffixSlot;
  }

  ngAfterContentInit(): void {
    // Necesario para OnPush: forzar re-evaluación tras resolver el slot proyectado
    this.cdr.markForCheck();
  }

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
