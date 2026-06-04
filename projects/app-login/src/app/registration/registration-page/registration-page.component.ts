import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
  readonly svc = inject(RegistrationService);

  readonly stepLabels = [
    { label: 'Tus datos',       icon: 'person' },
    { label: 'Tu contraseña',   icon: 'lock' },
    { label: 'Verificar email', icon: 'mark_email_read' },
  ];

  get currentWizardStep(): number {
    // step 0 = role selection (no progress bar), steps 1-3 = wizard
    return this.svc.step() - 1;
  }

  isWizard(): boolean {
    return this.svc.step() >= 1;
  }
}
