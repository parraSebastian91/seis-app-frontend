import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdjuntoItem } from '../../types/adjunto.type';

/** Mapa de iconos semánticos → símbolo CSS/Unicode */
const ICON_UNICODE: Record<string, string> = {
  picture_as_pdf: '📄',
  image:          '🖼',
  attach_file:    '📎',
  cloud_upload:   '☁',
  folder_open:    '📁',
  visibility:     '◉',
};

@Component({
  selector: 'lib-adjuntos-list',
  standalone: true,
  imports: [],
  templateUrl: './adjuntos-list.component.html',
  styleUrl: './adjuntos-list.component.scss',
})
export class AdjuntosListComponent {
  @Input() adjuntos: AdjuntoItem[] = [];
  @Input() selectedId: string | null = null;
  @Input() loadingId: string | null = null;
  @Input() canUpload: boolean = false;
  @Input() titulo: string = 'Documentos adjuntos';

  @Output() adjuntoSelected = new EventEmitter<AdjuntoItem>();
  @Output() uploadRequested = new EventEmitter<void>();

  resolveIcon(iconKey: string): string {
    return ICON_UNICODE[iconKey] ?? '📎';
  }

  trackById(_i: number, adj: AdjuntoItem): string {
    return adj.id;
  }
}
