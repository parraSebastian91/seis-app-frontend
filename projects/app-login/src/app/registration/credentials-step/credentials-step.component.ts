import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'app-credentials-step',
  templateUrl: './credentials-step.component.html',
  styleUrl: './credentials-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsStepComponent {
  private readonly svc = inject(RegistrationService);
  private readonly fb = inject(FormBuilder);

  readonly showPassword = signal(false);
  readonly showConfirm = signal(false);
  readonly serverError = signal('');
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm:  ['', [Validators.required]],
    terms:    [false, [Validators.requiredTrue]],
  });

  get passwordValue(): string {
    return this.form.get('password')?.value ?? '';
  }

  get confirmMismatch(): boolean {
    const { password, confirm } = this.form.getRawValue();
    return !!confirm && confirm !== password;
  }

  get canContinue(): boolean {
    const { password, confirm, terms } = this.form.getRawValue();
    return (
      password.length >= 8 &&
      confirm === password &&
      terms === true
    );
  }

  onContinue(): void {
    if (!this.canContinue) return;
    const { password } = this.form.getRawValue();
    this.svc.patch({ password });

    this.loading.set(true);
    this.serverError.set('');

    this.svc.register().subscribe({
      next: () => {
        this.loading.set(false);
        this.svc.goNext();
      },
      error: (err) => {
        this.loading.set(false);
        const msg = (err?.error?.message as string | undefined) ?? '';
        if (msg.includes('email')) {
          this.serverError.set('Este email ya tiene una cuenta registrada. ¿Quieres iniciar sesión?');
        } else if (msg.includes('rut')) {
          this.serverError.set('Ya existe una cuenta con este RUT.');
        } else {
          this.serverError.set('Ocurrió un error. Intenta de nuevo.');
        }
      },
    });
  }

  onBack(): void {
    this.svc.goBack();
  }
}
