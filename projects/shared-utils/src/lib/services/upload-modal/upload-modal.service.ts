import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface UploadModalConfig {
  accept?: string;          // ej. '.pdf,.xml,image/*'
  title?: string;           // título del modal
  hint?: string;            // texto de ayuda
  context?: string;         // clave libre para que el suscriptor sepa quién abrió el modal
}

export interface UploadModalResult {
  file: File;
  context?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadModalService {
  private readonly _open$ = new Subject<UploadModalConfig>();
  private readonly _fileSelected$ = new Subject<UploadModalResult>();
  private readonly _close$ = new Subject<void>();

  /** El componente modal escucha esto para mostrarse */
  readonly open$: Observable<UploadModalConfig> = this._open$.asObservable();

  /** Los MFEs escuchan esto para recibir el archivo seleccionado */
  readonly fileSelected$: Observable<UploadModalResult> = this._fileSelected$.asObservable();

  /** Cualquier parte puede escuchar cuando se cierra el modal sin seleccionar */
  readonly close$: Observable<void> = this._close$.asObservable();

  /** Llamado por los MFEs para solicitar apertura del modal */
  open(config: UploadModalConfig = {}): void {
    this._open$.next(config);
  }

  /** Llamado internamente por el componente modal al confirmar */
  emitFile(result: UploadModalResult): void {
    this._fileSelected$.next(result);
  }

  /** Llamado internamente por el componente modal al cancelar/cerrar */
  emitClose(): void {
    this._close$.next();
  }
}
