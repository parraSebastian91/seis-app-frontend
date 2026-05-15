
export enum facturaEstado {
  PROCESANDO = "PROCESANDO",
  PENDIENTE_VALIDACION = "PENDIENTE_VALIDACION",
  PUBLICADA = "PUBLICADA",
  OFERTADA = "OFERTADA",
  FINANCIADA = "FINANCIADA",
  PAGADA = "PAGADA",
  RECHAZADA = "RECHAZADA",
  CANCELADA = "CANCELADA",
  VENCIDA = "VENCIDA",
  DENUNCIADA = "DENUNCIADA",
}

export interface FacturaType {
  assetId: string;
  ownerUUID: string;
  nombre_mandante: string;
  rut_mandante: string;
  gestor: string;
  deudorNombre: string;
  deudorRut: string;
  facturaNumero: string;
  montoTotal: number;
  fechaVencimiento: Date;
  status: facturaEstado;
  correlationId: string;
  storage_key: string;
  ofertas: string;
}

export interface FacturaOfertaType {
  assetId: string;
  ofertaId: string;
  montoOferta: number;
  plazoOferta: number;
  tasaInteres: number;
  fechaOferta: Date;
  estadoOferta: string;
}
