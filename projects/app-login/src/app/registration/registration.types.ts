export type RegistrationRole = 'CEDENTE' | 'EJECUTIVO';

export interface RegistrationData {
  role: RegistrationRole | null;
  // Step 1 — personal data
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  telefono: string;
  // Step 2 — credentials
  password: string;
  acceptedTerms: boolean;
}

export const REGISTRATION_DATA_INITIAL: RegistrationData = {
  role: null,
  nombre: '',
  apellido: '',
  rut: '',
  email: '',
  telefono: '',
  password: '',
  acceptedTerms: false,
};
