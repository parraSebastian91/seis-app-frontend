import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_REGISTRY } from './icon-registry';

/**
 * Ícono SVG inline — reemplaza `<mat-icon>` sin depender de @angular/material
 * ni de la fuente de íconos (Material Icons/Symbols vía Google Fonts, que es
 * justo lo que rompía en Storybook: sin la fuente cargada, `<mat-icon>close`
 * se veía como el texto plano "close").
 *
 * Mismos ~98 nombres que ya usaban las plantillas con `<mat-icon>nombre</mat-icon>`
 * (ver ICON_REGISTRY) — migrar es un search&replace de tag, sin tocar nombres.
 *
 * Uso:
 *   <app-icon name="close" />
 *   <app-icon name="group" size="16" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="viewBox"
      [attr.width]="size"
      [attr.height]="size"
      [innerHTML]="svgContent"
      fill="currentColor"
      aria-hidden="true"
    ></svg>
  `,
  styles: [':host { display: inline-flex; line-height: 0; }'],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input({ required: true }) name = '';
  @Input() size: number | string = 20;

  get viewBox(): string {
    return ICON_REGISTRY[this.name]?.viewBox ?? '0 -960 960 960';
  }

  get svgContent(): SafeHtml {
    const def = ICON_REGISTRY[this.name];
    if (!def) {
      // Ícono no registrado: no rompe el render, solo queda vacío (y avisa en consola).
      console.warn(`[app-icon] Ícono no encontrado en ICON_REGISTRY: "${this.name}"`);
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(def.content);
  }
}
