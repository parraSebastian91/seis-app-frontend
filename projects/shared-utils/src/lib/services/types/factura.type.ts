
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
  facturaId: string;
  assetId: string;
  ownerUUID: string;
  nombre_mandante: string;
  rut_mandante: string;
  gestor: {
    uuid: string;
    username: string;
  };
  gestorUUID: string;
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

export interface FacturaCreateRequestDto {
  facturaId: string;
  ownerUUID: string;
  numeroFactura: string;
  rutDeudor: string;
  nombreDeudor: string;
  correlationId: string;
  montoTotal: number;
  fechaVencimiento: Date;
  gestor: {
    uuid: string;
    username: string;
  };
}

export interface FacturaRequestDTO {
  id: string;
  ownerUUID: string;
  gestor: {
    uuid: string;
    username: string;
  };
  campoEditado: CampoEditado;
}

export interface CampoEditado {
  nombre: string;
  valor: string;
}

export interface FacturaResponseUpdateDTO { campo: string, id: string, valor: any, isUpdate: any, mensaje: string }