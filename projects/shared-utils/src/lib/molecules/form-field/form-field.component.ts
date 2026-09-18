import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '../../atoms/label/label.component';

/** Marca el/los mensaje(s) de error condicionales — mismo rol que `<mat-error>`. */
@Directive({ selector: '[form-field-error]', standalone: true })
export class FormFieldErrorDirective {}

/**
 * Reemplaza `<mat-form-field>+<mat-label>+<mat-error>` de Angular Material
 * (6 archivos del workspace: user-profile/view, admin-miembros,
 * admin-solicitudes, admin-grupo-detalle, admin-grupos, org-profile).
 *
 * No reemplaza el control en sí — el borde rojo en error lo sigue manejando
 * `<app-input [hasError]="...">` (o el futuro `<app-select>`); este molecule
 * solo aporta el label y el slot de mensaje(s) de error debajo, igual que
 * `<mat-error>` podía repetirse varias veces por campo.
 *
 * Uso:
 *   <app-form-field label="Correo">
 *     <app-input type="email" formControlName="correo"
 *                [hasError]="form.get('correo')?.invalid ?? false" />
 *     <span form-field-error *ngIf="form.get('correo')?.hasError('email')">
 *       Formato de email inválido
 *     </span>
 *   </app-form-field>
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-label [text]="label" [required]="required">
      <ng-content></ng-content>
    </app-label>
    <div class="form-field__error">
      <ng-content select="[form-field-error]"></ng-content>
    </div>
  `,
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() required = false;
}
