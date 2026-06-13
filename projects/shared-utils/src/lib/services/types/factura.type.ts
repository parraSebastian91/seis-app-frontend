
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

export enum createdBy{
    FORM = "FORM",
    OCR = "OCR",
    AGENT = "AGENT"
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

export interface FacturaAdjuntoType {
  id: string;
  asset_id: string;
  tipo: string;         // 'FACTURA_ORIGINAL' | 'orden-compra' | etc. (media.categoria.codigo)
  es_principal: boolean;
  orden: number;
  descripcion: string | null;
  url_path: string | null;
}

export interface FacturaType {
  facturaId: string;
  assetId: string;      // puede llegar vacío cuando los adjuntos están en adjuntos[]
  ownerUUID: string;    // cedente_org_id
  gestor: {
    uuid: string;
    username: string;
  };
  adjuntos?: FacturaAdjuntoType[];
  nombre_cliente_cedente: string;
  rut_cliente_cedente: string;
  deudorNombre: string;
  deudorRut: string;
  facturaNumero: string;
  montoTotal: number;
  fechaVencimiento: Date;
  status: facturaEstado;
  correlationId: string;
  total_ofertas: string | number;     // el backend retorna string desde la vista SQL; los componentes inicializan con 0
  ofertas_enviadas: string | number;
  ofertas_revisadas: string | number;
  ofertas_aceptadas: string | number;
  ofertas_rechazadas: string | number;
  url_factura: string | null;
  createdBy?: createdBy;
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
  fechaEmision?: Date;
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

export enum ofertaEstado {
  ACTIVA = 'ACTIVA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  VENCIDA = 'VENCIDA',
}

export interface OfertaDetalleType {
  ofertaId: string;
  assetId?: string;
  ejecutivoNombre: string;
  ejecutivoAvatarUrl?: string;
  financieraNombre?: string;
  montoAnticipo: number;
  porcentajeAnticipo: number;
  tasaMensual: number;
  gastosOperacionales: number;
  liquidoRecibir: number;
  fechaVigencia: Date;
  estado: ofertaEstado;
}