import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrNota } from '../../types/ocr-nota.type';

@Component({
  selector: 'app-ocr-notes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './ocr-notes-list.component.html',
  styleUrl: './ocr-notes-list.component.scss'
})
export class OcrNotesListComponent {
  @Input() notas: OcrNota[] = [];
  /** En modo readOnly no se muestran acciones de descarte */
  @Input() readOnly = false;
}
