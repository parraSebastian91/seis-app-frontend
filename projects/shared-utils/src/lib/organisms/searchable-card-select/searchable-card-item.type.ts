export interface SearchableCardItem {
  id: string;
  name: string;
  /** Texto secundario (ej. "Cedente · Añadido 01/2024"). */
  meta?: string;
  /** URL del avatar; si no hay o está rota, se muestran iniciales. */
  avatarUrl?: string;
}
