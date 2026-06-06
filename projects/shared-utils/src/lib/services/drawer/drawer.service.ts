import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DrawerConfig } from './drawer.types';

/**
 * Servicio singleton que controla el AppDrawer del portal.
 *
 * Uso desde cualquier MFE o componente:
 *
 *   const events$ = this.drawerService.open({
 *     title: 'Detalle',
 *     component: MiContenidoComponent,
 *     inputs: { data: someData },
 *   });
 *
 *   events$.subscribe(event => { ... });
 */
@Injectable({ providedIn: 'root' })
export class DrawerService {
  /** Configuración activa. null = drawer cerrado. */
  readonly #config = signal<DrawerConfig | null>(null);
  readonly config = this.#config.asReadonly();

  /** Bus de eventos desde el componente interno hacia el caller. */
  readonly #events$ = new Subject<unknown>();

  /**
   * Abre el drawer con el componente y datos indicados.
   * @returns Observable<TOutput> que emite cada vez que el componente interno
   *          llama a `drawerService.emit(payload)` y completa cuando se cierra.
   */
  open<TInput, TOutput>(config: DrawerConfig<TInput, TOutput>): Observable<TOutput> {
    this.#config.set(config as DrawerConfig);
    return this.#events$.asObservable() as Observable<TOutput>;
  }

  /**
   * El componente interno llama a este método para enviar un evento al caller.
   * Equivalente a un @Output() pero desacoplado del DOM.
   */
  emit(event: unknown): void {
    this.#events$.next(event);
  }

  /** Cierra el drawer y resetea la configuración. */
  close(): void {
    this.#config.set(null);
  }
}
