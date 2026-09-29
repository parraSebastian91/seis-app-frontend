import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RegistrationService } from '../registration.service';
import { RouterLink } from '@angular/router';
import { RoleSelectionStepComponent } from '../role-selection-step/role-selection-step.component';
import { PersonalDataStepComponent } from '../personal-data-step/personal-data-step.component';
import { CredentialsStepComponent } from '../credentials-step/credentials-step.component';
import { EmailVerificationStepComponent } from '../email-verification-step/email-verification-step.component';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  imports: [RouterLink, RoleSelectionStepComponent, PersonalDataStepComponent,
    CredentialsStepComponent, EmailVerificationStepComponent],
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
