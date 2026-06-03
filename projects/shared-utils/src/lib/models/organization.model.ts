export interface Organization {
  id: string;
  uuid: string;
  nombre: string;
  rut: string;
  tipo: 'CEDENTE' | 'FINANCIERA' | 'BROKER';
  logoUrl?: string;
}
