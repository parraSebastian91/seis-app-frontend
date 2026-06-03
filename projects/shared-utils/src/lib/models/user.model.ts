export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'USR_STD'
  | 'SUPERVISOR'
  | 'READ_ONLY'
  | 'CLIENTE_CEDENTE'
  | 'EJECUTIVO_FINANCIADORA'
  | 'ADMIN_FINANCIADORA'
  | 'ADMIN_CEDENTE'
  | 'ADMIN_BROKER'
  | 'EJECUTIVO_BROKER';

export interface User {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  username: string;
  avatarUrl?: string;
  rol: UserRole;
}
