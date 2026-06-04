import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RegistrationService } from '../registration.service';
import { OtpInputComponent } from '../otp-input/otp-input.component';

const RESEND_COOLDOWN = 60;

@Component({
  selector: 'app-email-verification-step',
  templateUrl: './email-verification-step.component.html',
  styleUrl: './email-verification-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationStepComponent implements OnInit, OnDestroy {
  private readonly svc = inject(RegistrationService);

  @ViewChild(OtpInputComponent) private readonly otpInput?: OtpInputComponent;

  readonly email = this.svc.data().email;
  readonly countdown = signal(RESEND_COOLDOWN);
  readonly errorMessage = signal('');
  readonly verifying = signal(false);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  private startCountdown(): void {
    this.clearInterval();
    this.countdown.set(RESEND_COOLDOWN);
    this.countdownInterval = setInterval(() => {
      this.countdown.update(c => {
        if (c <= 1) {
          this.clearInterval();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  private clearInterval(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  onOtpComplete(otp: string): void {
    this.verifying.set(true);
    this.errorMessage.set('');

    this.svc.verifyEmail(otp).subscribe({
      next: () => {
        this.verifying.set(false);
        // Redirect to portal — the shell will handle NoOrganizationGate
        globalThis.location.href = 'http://localhost:4200/contenedor';
      },
      error: (err) => {
        this.verifying.set(false);
        const msg = (err?.error?.message as string | undefined) ?? '';
        if (msg.includes('expir')) {
          this.errorMessage.set('El código expiró. Solicita uno nuevo.');
        } else {
          this.errorMessage.set('Código incorrecto. Inténtalo de nuevo.');
          this.otpInput?.shake();
        }
      },
    });
  }

  onResend(): void {
    if (this.countdown() > 0) return;
    this.errorMessage.set('');
    this.svc.resendOtp().subscribe({
      next: () => this.startCountdown(),
    });
  }
}
