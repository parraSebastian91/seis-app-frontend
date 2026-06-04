import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationData, REGISTRATION_DATA_INITIAL } from './registration.types';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  readonly data = signal<RegistrationData>({ ...REGISTRATION_DATA_INITIAL });
  readonly step = signal<number>(0); // 0=role, 1=personal, 2=credentials, 3=otp

  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  patch(partial: Partial<RegistrationData>): void {
    this.data.update(d => ({ ...d, ...partial }));
  }

  goNext(): void {
    this.step.update(s => s + 1);
  }

  goBack(): void {
    this.step.update(s => Math.max(0, s - 1));
  }

  register(): Observable<{ userId: string }> {
    const d = this.data();
    return this.http.post<{ userId: string }>('/api/auth/register', {
      rol: d.role,
      nombre: d.nombre,
      apellido: d.apellido,
      rut: d.rut,
      email: d.email,
      telefono: `+56${d.telefono}`,
      password: d.password,
    });
  }

  verifyEmail(otp: string): Observable<void> {
    return this.http.post<void>('/api/auth/verify-email', { otp });
  }

  resendOtp(): Observable<void> {
    return this.http.post<void>('/api/auth/resend-otp', {});
  }

  reset(): void {
    this.data.set({ ...REGISTRATION_DATA_INITIAL });
    this.step.set(0);
  }
}
