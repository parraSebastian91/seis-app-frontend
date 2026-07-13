export type AdjuntoTipo =
  | 'Factura original'
  | 'Respaldo'
  | 'Documento legal'
  | 'Imagen'
  | 'Otro';

export interface AdjuntoItem {
  /** Identificador único del adjunto (assetId o correlationId temporal) */
  id: string;
  /** Nombre descriptivo del archivo */
  nombre: string;
  /** Tipo semántico del documento (para la UI) */
  tipo: AdjuntoTipo;
  /** MIME type del archivo */
  mediaType: string;
  /** URL de acceso al recurso */
  url: string;
  /** Ícono semántico (nombre de Material Icons o clave propia) */
  mediaIcon: string;
  /** Fecha de subida (ISO string, opcional) */
  fecha?: string;
}

/** Tipos de media admitidos con sus metadatos de presentación */
export const SUPPORTED_MEDIA_TYPES: Record<string, { label: string; icon: string; tipo: AdjuntoTipo }> = {
  'application/pdf': { label: 'PDF',  icon: 'picture_as_pdf', tipo: 'Respaldo' },
  'image/jpeg':      { label: 'JPEG', icon: 'image',          tipo: 'Imagen' },
  'image/png':       { label: 'PNG',  icon: 'image',          tipo: 'Imagen' },
  'image/webp':      { label: 'WEBP', icon: 'image',          tipo: 'Imagen' },
};

export function resolveMediaIcon(mediaType: string): string {
  return SUPPORTED_MEDIA_TYPES[mediaType]?.icon ?? 'attach_file';
}

export function resolveMediaTypeFromUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf'))  return 'application/pdf';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.png'))  return 'image/png';
  if (lower.startsWith('data:image/')) {
    const match = url.match(/^data:(image\/[a-z]+);/);
    return match?.[1] ?? 'image/jpeg';
  }
  return 'image/jpeg';
}
