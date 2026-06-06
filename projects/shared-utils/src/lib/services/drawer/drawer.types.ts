import { EventEmitter, Type } from '@angular/core';

/**
 * Contrato que debe implementar cualquier componente inyectado en el AppDrawer.
 * TInput  → datos que recibe del caller (via ngComponentOutletInputs)
 * TOutput → tipo de los eventos que emite de vuelta al caller
 */
export interface DrawerContent<TInput = unknown, TOutput = unknown> {
  /** Datos de entrada provistos por el caller al abrir el drawer. */
  drawerInputs: TInput;
  /**
   * Canal de salida: el componente hace `this.drawerEvent.emit(payload)` y el
   * caller lo recibe a través del Observable devuelto por `DrawerService.open()`.
   */
  drawerEvent: EventEmitter<TOutput>;
}

/** Configuración que el caller pasa a DrawerService.open() */
export interface DrawerConfig<TInput = unknown, TOutput = unknown> {
  /** Título que se muestra en el header del drawer. */
  title: string;
  /** Componente standalone que se renderizará como contenido. */
  component: Type<DrawerContent<TInput, TOutput>>;
  /** Datos de entrada para el componente. */
  inputs: TInput;
  /** Ancho del panel (default '480px'). */
  width?: string;
}
