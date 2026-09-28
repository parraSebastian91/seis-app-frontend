import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { SkeletonComponent } from '../../atoms/skeleton/skeleton.component';

export type DocumentViewerVariant = 'inline' | 'lightbox';

/**
 * Visor documental — unifica los dos visores que existían para la misma
 * HU-03 ("Visor documental facturas"):
 *
 * - `ImagePanzoomViewerComponent` (publicador-facturas): usaba
 *   `@panzoom/panzoom`, tenía bloqueo de gesto en mobile, no rotaba y no
 *   contemplaba estados de carga ni error.
 * - `VisorDocumentalComponent` (ofertador-facturas): pan/zoom a mano sobre
 *   `transform`, con rotación y estados loading/error, pero solo con eventos
 *   de mouse — en touch no se podía mover ni hacer pinch.
 *
 * Este componente toma el motor del primero (que sí soporta touch y pinch) y
 * las capacidades del segundo (rotación, loading, error). La diferencia que
 * quedaba entre ambos era de presentación, no de comportamiento, y se resuelve
 * con `variant`:
 *
 * - `inline`   → superficie clara, toolbar arriba, ocupa el contenedor.
 *                Equivale al visor del publicador.
 * - `lightbox` → fondo oscuro, toolbar flotante abajo, documento centrado con
 *                sombra. Equivale al visor del ofertador.
 *
 * El botón "Reintentar" del estado de error antes no hacía nada; ahora emite
 * `retry` para que el contenedor decida.
 *
 * Uso:
 *   <app-document-viewer [src]="url" [mobileMode]="isMobile()" />
 *   <app-document-viewer variant="lightbox" [src]="url" [loading]="cargando"
 *                        [error]="fallo" (retry)="recargar()" />
 */
@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, IconComponent, IconButtonComponent, ButtonComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
})
export class DocumentViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() src: string | null | undefined = null;
  @Input() altText = 'Documento';
  @Input() variant: DocumentViewerVariant = 'inline';
  @Input() loading = false;
  @Input() error = false;
  @Input() errorMessage = 'No se pudo cargar el documento.';
  /** Bloquea pan/zoom hasta que el usuario lo active — evita secuestrar el scroll en mobile. */
  @Input() mobileMode = false;
  @Input() allowRotate = true;

  @Output() retry = new EventEmitter<void>();

  @ViewChild('stage') stageRef?: ElementRef<HTMLElement>;
  @ViewChild('viewport') viewportRef?: ElementRef<HTMLElement>;

  private panzoom?: PanzoomObject;
  private boundViewport?: HTMLElement;

  interactionEnabled = true;
  rotation = 0;

  private readonly wheelHandler = (event: WheelEvent): void => {
    if (!this.panzoom || !this.interactionEnabled) {
      return;
    }

    event.preventDefault();
    this.panzoom.zoomWithWheel(event, { step: 0.15 });
  };

  get showDocument(): boolean {
    return !this.loading && !this.error && !!this.src;
  }

  ngAfterViewInit(): void {
    this.syncPanzoom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mobileMode']) {
      this.interactionEnabled = !this.mobileMode;
      this.applyInteractionMode();
    }

    if (changes['src']) {
      this.rotation = 0;
      this.panzoom?.reset();
    }

    // loading/error montan y desmontan el <img>, así que hay que reenganchar
    // panzoom cuando el documento vuelve a estar en el DOM.
    if (changes['loading'] || changes['error'] || changes['src']) {
      queueMicrotask(() => this.syncPanzoom());
    }
  }

  ngOnDestroy(): void {
    this.teardownPanzoom();
  }

  zoomIn(): void {
    this.panzoom?.zoomIn();
  }

  zoomOut(): void {
    this.panzoom?.zoomOut();
  }

  reset(): void {
    this.rotation = 0;
    this.panzoom?.reset();
  }

  rotate(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  toggleInteraction(): void {
    this.interactionEnabled = !this.interactionEnabled;
    this.applyInteractionMode();
  }

  onRetry(): void {
    this.retry.emit();
  }

  /** Engancha o suelta panzoom según el documento esté montado o no. */
  private syncPanzoom(): void {
    const stage = this.stageRef?.nativeElement;
    const viewport = this.viewportRef?.nativeElement;

    if (!stage || !viewport) {
      this.teardownPanzoom();
      return;
    }

    if (this.panzoom) {
      return;
    }

    this.panzoom = Panzoom(stage, {
      maxScale: 6,
      minScale: 0.5,
      contain: 'outside',
    });

    this.interactionEnabled = !this.mobileMode;
    this.applyInteractionMode();

    viewport.addEventListener('wheel', this.wheelHandler, { passive: false });
    this.boundViewport = viewport;
  }

  private teardownPanzoom(): void {
    this.boundViewport?.removeEventListener('wheel', this.wheelHandler);
    this.boundViewport = undefined;
    this.panzoom?.destroy();
    this.panzoom = undefined;
  }

  private applyInteractionMode(): void {
    this.panzoom?.setOptions({
      disablePan: !this.interactionEnabled,
      disableZoom: !this.interactionEnabled,
    });
  }
}
