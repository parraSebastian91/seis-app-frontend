import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
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
  readonly isMobile = this.viewport.isMobileSignal;

  readonly isOpen = signal(false);
  readonly closing = signal(false);
  readonly viewDate = signal(new Date());

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

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
  }

  close(): void {
    if (!this.isOpen()) return;
    this.onTouched();
    this.blurred.emit();
    if (!this.isMobile()) {
      this.isOpen.set(false);
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
