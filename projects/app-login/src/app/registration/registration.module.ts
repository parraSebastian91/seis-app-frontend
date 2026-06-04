import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RutInputComponent, PasswordStrengthMeterComponent } from 'shared-utils';

import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { RoleSelectionStepComponent } from './role-selection-step/role-selection-step.component';
import { PersonalDataStepComponent } from './personal-data-step/personal-data-step.component';
import { CredentialsStepComponent } from './credentials-step/credentials-step.component';
import { EmailVerificationStepComponent } from './email-verification-step/email-verification-step.component';
import { OtpInputComponent } from './otp-input/otp-input.component';

const routes: Routes = [
  { path: '', component: RegistrationPageComponent },
];

@NgModule({
  declarations: [
    RegistrationPageComponent,
    RoleSelectionStepComponent,
    PersonalDataStepComponent,
    CredentialsStepComponent,
    EmailVerificationStepComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    // Shared-utils standalone components
    RutInputComponent,
    PasswordStrengthMeterComponent,
    // Internal standalone
    OtpInputComponent,
  ],
})
export class RegistrationModule {}
