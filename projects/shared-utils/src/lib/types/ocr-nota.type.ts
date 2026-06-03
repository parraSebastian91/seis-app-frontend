export interface OcrNota {
  campo: string;
  descripcion: string;
  prioridad?: 'alta' | 'media' | 'baja';
}
