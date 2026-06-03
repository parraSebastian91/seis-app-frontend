import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AppTheme, DataThemeMode, OrgBrandTokens } from './theme.interface';

const STORAGE_KEY = 'app-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  // ===========================================================================
  // CA-06 — Gestión del tema (data-theme)
  // ===========================================================================

  /**
   * Establece el atributo `data-theme` en el elemento `<html>`.
   * MVP: siempre 'dark'. Post-MVP: leer preferencia del usuario.
   */
  setDataTheme(mode: DataThemeMode = 'dark'): void {
    this.document.documentElement.setAttribute('data-theme', mode);
  }

  /**
   * Inicializa el sistema de temas al arrancar la aplicación.
   * 1. Aplica data-theme="dark" (MVP fijo).
   * 2. Aplica cualquier AppTheme persistido en localStorage.
   */
  initTheme(): void {
    this.setDataTheme('dark');
    const loaded = this.loadTheme();
    if (loaded) this.setTheme(loaded);
  }

  // ===========================================================================
  // CA-05 — Tokens de organización (Capa 3)
  // ===========================================================================

  /**
   * Inyecta los tokens de marca de la organización activa en el elemento raíz.
   * Llama a `validateContrast` antes de persistir cualquier color.
   */
  applyOrgTokens(tokens: OrgBrandTokens): void {
    const root = this.document.documentElement;
    root.style.setProperty('--org-brand-primary',     tokens.brandPrimary);
    root.style.setProperty('--org-brand-primary-dim', tokens.brandPrimaryDim);
    root.style.setProperty('--org-brand-on-primary',  tokens.brandOnPrimary);
  }

  /** Restaura los tokens de organización a los defaults de Factor. */
  resetOrgTokens(): void {
    const root = this.document.documentElement;
    root.style.removeProperty('--org-brand-primary');
    root.style.removeProperty('--org-brand-primary-dim');
    root.style.removeProperty('--org-brand-on-primary');
  }

  // ===========================================================================
  // CA-05 / EB-01 — Validación de contraste WCAG AA
  // ===========================================================================

  /**
   * Valida que el par de colores cumple ratio WCAG AA ≥ 4.5:1 para texto normal.
   * Acepta colores en formato hex (#RRGGBB o #RGB).
   * Returns `true` si el contraste es suficiente.
   */
  validateContrast(bg: string, fg: string): boolean {
    const bgLum = this.relativeLuminance(bg);
    const fgLum = this.relativeLuminance(fg);
    const lighter = Math.max(bgLum, fgLum);
    const darker  = Math.min(bgLum, fgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    return ratio >= 4.5;
  }

  // ===========================================================================
  // AppTheme (legacy — Material theme override)
  // ===========================================================================

  setTheme(theme: AppTheme): void {
    const root = this.document.documentElement;
    if (theme.primary)   root.style.setProperty('--primary', theme.primary);
    if (theme.accent)    root.style.setProperty('--accent', theme.accent);
    if (theme.warn)      root.style.setProperty('--warn', theme.warn);
    if (theme.background) root.style.setProperty('--background', theme.background);
    if (theme.onPrimary)  root.style.setProperty('--on-primary', theme.onPrimary);

    // Angular Material MDC tokens
    if (theme.primary)    root.style.setProperty('--mdc-theme-primary', theme.primary);
    if (theme.accent)     root.style.setProperty('--mdc-theme-secondary', theme.accent);
    if (theme.background) root.style.setProperty('--mdc-theme-surface', theme.background);
    if (theme.onPrimary)  root.style.setProperty('--mdc-theme-on-primary', theme.onPrimary);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }

  loadTheme(): AppTheme | null {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    try {
      const theme: AppTheme = JSON.parse(v);
      this.setTheme(theme);
      return theme;
    } catch {
      return null;
    }
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    const style = globalThis.getComputedStyle?.(this.document.documentElement);
    this.setTheme({
      primary:    style?.getPropertyValue('--primary').trim()    || '#1976d2',
      secondary:  style?.getPropertyValue('--secondary').trim()  || '#1976d2',
      onFocus:    style?.getPropertyValue('--on-focus').trim()   || '#1976d2',
      accent:     style?.getPropertyValue('--accent').trim()     || '#ff4081',
      warn:       style?.getPropertyValue('--warn').trim()       || '#f44336',
      background: style?.getPropertyValue('--background').trim() || '#ffffff',
      onPrimary:  style?.getPropertyValue('--on-primary').trim() || '#ffffff',
    });
  }

  // ===========================================================================
  // Private helpers
  // ===========================================================================

  private relativeLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const sanitized = hex.replace('#', '');
    const full = sanitized.length === 3
      ? sanitized.split('').map(c => c + c).join('')
      : sanitized;
    if (full.length !== 6) return null;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
}

