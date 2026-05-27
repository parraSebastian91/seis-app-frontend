
export enum facturaEstado {
  PENDIENTE_AUTORIZACION = "PENDIENTE_AUTORIZACION",
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

export enum facturaEstadoDescripcion {
  PENDIENTE_AUTORIZACION = "Pendiente de autorización",
  PROCESANDO = "Procesando",
  PENDIENTE_VALIDACION = "Pendiente de validación",
  PUBLICADA = "Publicada",
  OFERTADA = "Ofertada",
  FINANCIADA = "Financiada",
  PAGADA = "Pagada",
  RECHAZADA = "Rechazada",
  CANCELADA = "Cancelada",
  VENCIDA = "Vencida",
  DENUNCIADA = "Denunciada"
}

export interface FacturaType {
  facturaId: string;
  assetId: string;
  ownerUUID: string; // cedente_org_id
  gestor: {
    uuid: string;
    username: string;
  };
  nombre_cliente_cedente: string; // deudor_nombre
  rut_cliente_cedente: string; // deudor_rut
  deudorNombre: string;
  deudorRut: string;
  facturaNumero: string;
  montoTotal: number;
  fechaVencimiento: Date;
  status: facturaEstado;
  correlationId: string;
  total_ofertas: number;
  ofertas_enviadas: number;
  ofertas_revisadas: number;
  ofertas_aceptadas: number;
  ofertas_rechazadas: number;
  url_factura: string | null;
  notas?: string[];
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
  status: facturaEstado;
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

export interface VersionTerminos {
  id: string;
  codigo: string;
  descripcion: string;
  textCompleto: string;
  hashSha256: string;
}

export interface AutorizacionPublicacionDto {
  facturaId: string;
  versionTerminosId: string;
  acepto: boolean;
  correlationId?: string;
}