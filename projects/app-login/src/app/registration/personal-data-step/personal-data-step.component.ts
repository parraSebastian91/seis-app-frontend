import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'app-personal-data-step',
  templateUrl: './personal-data-step.component.html',
  styleUrl: './personal-data-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataStepComponent {
  private readonly svc = inject(RegistrationService);
  private readonly fb = inject(FormBuilder);

  readonly rutValue = signal('');
  readonly rutValid = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombre:   ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email:    ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  });

  get canContinue(): boolean {
    return this.form.valid && this.rutValid();
  }

  onRutChange(value: string): void {
    this.rutValue.set(value);
  }

  onRutValidChange(valid: boolean): void {
    this.rutValid.set(valid);
  }

  onContinue(): void {
    if (!this.canContinue) return;
    const { nombre, apellido, email, telefono } = this.form.getRawValue();
    this.svc.patch({ nombre, apellido, rut: this.rutValue(), email, telefono });
    this.svc.goNext();
  }

  onBack(): void {
    this.svc.goBack();
  }

  fieldError(name: 'nombre' | 'apellido' | 'email' | 'telefono'): string {
    const ctrl = this.form.get(name);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Este campo es requerido.';
    if (ctrl.hasError('minlength')) return 'Mínimo 2 caracteres.';
    if (ctrl.hasError('email')) return 'Email inválido.';
    if (ctrl.hasError('pattern')) return 'Ingresa 9 dígitos (sin el prefijo +56).';
    return '';
  }
}
