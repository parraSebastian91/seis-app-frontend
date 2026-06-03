export interface AppTheme {
    primary: string;
    secondary: string;
    accent: string;
    onFocus: string;
    warn?: string;
    background?: string;
    onPrimary?: string;
}

export type DataThemeMode = 'dark' | 'light';

/** Tokens de marca de organización (Capa 3 del design system, CA-05 HU-37). */
export interface OrgBrandTokens {
  /** Color de acento principal de la organización (hex). */
  brandPrimary: string;
  /** Variante oscurecida del acento (hover / dim). */
  brandPrimaryDim: string;
  /** Color de texto/ícono sobre el acento — debe tener ratio WCAG AA ≥ 4.5:1. */
  brandOnPrimary: string;
}
