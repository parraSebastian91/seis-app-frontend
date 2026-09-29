import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { ViewportService } from '../../services/layout/viewport.service';

interface DayCell {
  key: string;
  day: number;
  inMonth: boolean;
  selected: boolean;
  today: boolean;
  disabled: boolean;
}

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function toIso(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIso(value: string | null | undefined): Date | null {
  const normalized = String(value ?? '').trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Datepicker nativo — reemplaza `AtomicDatepickerComponent`
 * (publicador-facturas), que dependía de `NgbInputDatepicker`
 * (@ng-bootstrap/ng-bootstrap). Calendario propio (sin librería externa),
 * mismo criterio que el resto del design system con Angular Material: cero
 * dependencias de terceros para UI.
 *
 * Popup en desktop, bottom-sheet deslizante en mobile (breakpoint 700px vía
 * `ViewportService`, el mismo que usa el sidebar/`AppDrawerComponent` del
 * portal) — construido acá mismo, sin depender de `DrawerService`: éste es
 * un átomo de formulario que debe funcionar standalone en cualquier MFE, no
 * asumir que el shell montó un host de drawer.
 *
 * Implementa ControlValueAccessor (formControlName/ngModel) y además expone
 * `[value]`/`(valueChange)` directo — mismo API dual que Checkbox/SlideToggle
 * — para facilitar la migración 1:1 desde `AtomicDatepickerComponent`.
 * Valor: string ISO 'YYYY-MM-DD'. `minDate`/`maxDate` también ISO (no
 * `NgbDateStruct`).
 *
 * Uso:
 *   <app-datepicker formControlName="fechaEmision" [maxDate]="todayIso" />
 *   <app-datepicker [value]="fecha" (valueChange)="fecha = $event" [hasError]="..." />
 */
@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, IconComponent, IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() value = '';
  @Input() disabled = false;
  @Input() placeholder = 'dd-mm-aaaa';
  @Input() hasError = false;
  @Input() minDate: string | null = null;
  @Input() maxDate: string | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();

  private readonly viewport = inject(ViewportService);
  private readonly host = inject(ElementRef<HTMLElement>);
  /**
   * Necesario a propósito: `requestAnimationFrame` y el callback de
   * `ResizeObserver` NO están parcheados por zone.js, así que escribir
   * `panelPos` desde ahí actualiza el signal pero no dispara render — el panel
   * se quedaba sin sus estilos inline, invisible o mal ubicado. Todo lo que
   * toque estado desde esos callbacks va dentro de `zone.run`.
   */
  private readonly zone = inject(NgZone);
  readonly isMobile = this.viewport.isMobileSignal;

  readonly isOpen = signal(false);
  readonly closing = signal(false);
  readonly viewDate = signal(new Date());

  /**
   * Posición del popup en coordenadas de viewport.
   *
   * El panel es `position: fixed`, no `absolute`: siendo absolute quedaba
   * recortado por cualquier ancestro con `overflow` distinto de visible. Pasó
   * en vivo dentro del modal de publicación de facturas, donde `.tab-content`
   * scrollea: el calendario se abría pero solo se veía su cabecera.
   *
   * Nota para el futuro: `position: fixed` se resuelve contra el viewport
   * salvo que un ancestro cree un containing block (`transform`, `filter`,
   * `backdrop-filter`…). `app-modal` usa `backdrop-filter` en su backdrop,
   * pero ese backdrop es `fixed; inset: 0` — o sea, exactamente el viewport —
   * así que las coordenadas coinciden igual.
   */
  readonly panelPos = signal<{ top: number; left: number } | null>(null);

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private panelObserver: ResizeObserver | null = null;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get displayValue(): string {
    const date = parseIso(this.value);
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  }

  get monthLabel(): string {
    const d = this.viewDate();
    return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
  }

  readonly weekdayLabels = WEEKDAY_LABELS;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const parsed = parseIso(this.value);
      this.viewDate.set(parsed ?? new Date());
    }
  }

  ngOnDestroy(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.listenViewport(false);
    this.panelObserver?.disconnect();
  }

  writeValue(value: string): void {
    this.value = value ?? '';
    const parsed = parseIso(this.value);
    this.viewDate.set(parsed ?? new Date());
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  open(): void {
    if (this.disabled || this.isOpen()) return;
    const parsed = parseIso(this.value);
    this.viewDate.set(parsed ?? new Date());
    this.closing.set(false);
    this.isOpen.set(true);
    if (!this.isMobile()) {
      this.listenViewport(true);
      // El posicionamiento no se dispara acá: lo hace el setter de @ViewChild
      // cuando el panel entra al DOM. Con requestAnimationFrame el elemento
      // todavía no existía y no se posicionaba nunca.
    }
  }

  /**
   * Se dispara cuando el panel entra o sale del DOM, dentro del ciclo de
   * render de Angular — no hay que adivinar el momento con timers.
   *
   * Se observa su tamaño porque el alto cambia solo: un mes de 6 semanas es
   * una fila más alto que uno de 5, y si el panel está abierto hacia arriba
   * eso lo correría de lugar.
   */
  @ViewChild('panelEl')
  set panelEl(ref: ElementRef<HTMLElement> | undefined) {
    this.panelObserver?.disconnect();
    this.panelObserver = null;
    if (!ref) return;
    if (typeof ResizeObserver === 'undefined') {
      this.positionPanel();
      return;
    }
    this.panelObserver = new ResizeObserver(() => this.positionPanel());
    this.panelObserver.observe(ref.nativeElement);
  }

  /** Coloca el panel bajo el campo, o encima si no entra abajo. */
  private positionPanel(): void {
    if (!this.isOpen() || this.isMobile()) return;
    const el = this.host.nativeElement as HTMLElement;
    const field = el.querySelector('.datepicker__field-wrap') as HTMLElement | null;
    const panel = el.querySelector('.datepicker__panel') as HTMLElement | null;
    if (!field || !panel) return;

    const GAP = 6;
    const MARGIN = 8;
    const f = field.getBoundingClientRect();
    const ph = panel.offsetHeight;
    const pw = panel.offsetWidth;

    const espacioAbajo = window.innerHeight - f.bottom;
    const arriba = espacioAbajo < ph + GAP + MARGIN && f.top > ph + GAP + MARGIN;
    const top = arriba ? f.top - ph - GAP : f.bottom + GAP;

    // No dejar que se salga por la derecha en pantallas angostas.
    const left = Math.max(MARGIN, Math.min(f.left, window.innerWidth - pw - MARGIN));

    this.zone.run(() =>
      this.panelPos.set({ top: Math.round(top), left: Math.round(left) }),
    );
  }

  /**
   * Al ser `fixed`, el panel no sigue al campo cuando algo scrollea detrás.
   *
   * El listener va en `document` y con `capture: true` a propósito: el evento
   * `scroll` de un contenedor interno NO burbujea hasta `window`, así que un
   * `@HostListener('window:scroll')` no se enteraría del caso que justamente
   * importa — el cuerpo scrolleable de un modal.
   */
  private readonly reposition = () => {
    if (this.isOpen() && !this.isMobile()) this.positionPanel();
  };

  private listenViewport(on: boolean): void {
    if (typeof document === 'undefined') return;
    const fn = on ? 'addEventListener' : 'removeEventListener';
    document[fn]('scroll', this.reposition, true);
    window[fn]('resize', this.reposition);
  }

  close(): void {
    if (!this.isOpen()) return;
    this.onTouched();
    this.blurred.emit();
    if (!this.isMobile()) {
      this.isOpen.set(false);
      this.panelPos.set(null);
      this.listenViewport(false);
      this.panelObserver?.disconnect();
      this.panelObserver = null;
      return;
    }
    this.closing.set(true);
    this.closeTimer = setTimeout(() => {
      this.isOpen.set(false);
      this.closing.set(false);
    }, 220);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDay(cell: DayCell): void {
    if (cell.disabled) return;
    this.value = cell.key;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.close();
  }

  calendarCells(): DayCell[] {
    const viewDate = this.viewDate();
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    // Lunes = 0 ... Domingo = 6
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - firstWeekday);

    const selected = parseIso(this.value);
    const today = new Date();
    const min = parseIso(this.minDate);
    const max = parseIso(this.maxDate);

    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const disabled = (!!min && date < min) || (!!max && date > max);
      cells.push({
        key: toIso(date),
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        selected: !!selected && sameDay(date, selected),
        today: sameDay(date, today),
        disabled,
      });
    }
    return cells;
  }
}
