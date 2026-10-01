import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

/** Formatea una cadena de dígitos como RUT chileno: XX.XXX.XXX-K */
function formatRut(digits: string): string {
  if (digits.length === 0) return '';
  const dv = digits.slice(-1);
  const body = digits.slice(0, -1);
  if (body.length === 0) return dv;
  const bodySeparated = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${bodySeparated}-${dv}`;
}

/** Extrae solo los caracteres alfanuméricos del RUT (dígitos + K/k). */
function stripRut(raw: string): string {
  return raw.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Calcula el dígito verificador de un RUT (cuerpo numérico sin DV).
 * Devuelve '0'-'9' o 'K'.
 */
function calcDv(body: string): string {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return String(remainder);
}

type RutState = 'idle' | 'valid' | 'invalid';

@Component({
  selector: 'app-rut-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './rut-input.component.html',
  styleUrl: './rut-input.component.scss',
})
export class RutInputComponent implements OnChanges {
  @Input() value = '';
  @Input() name = 'rut';
  @Input() placeholder = 'Ej: 12.345.678-9';
  @Input() required = false;
  /** ID del input para accesibilidad (aria-describedby). */
  @Input() inputId = 'rut-input';

  /** Emite el valor formateado con máscara: "XX.XXX.XXX-K". */
  @Output() readonly valueChange = new EventEmitter<string>();
  /** Emite true cuando el DV es válido y el cuerpo tiene al menos 7 dígitos. */
  @Output() readonly validChange = new EventEmitter<boolean>();

  displayValue = '';
  state: RutState = 'idle';

  private readonly cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value !== this.displayValue) {
      const clean = stripRut(this.value);
      this.displayValue = clean.length > 0 ? formatRut(clean) : '';
      this.state = 'idle';
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const clean = stripRut(raw);

    if (clean.length === 0) {
      this.displayValue = '';
      this.state = 'idle';
      this.valueChange.emit('');
      this.validChange.emit(false);
      this.cdr.markForCheck();
      return;
    }

    const formatted = formatRut(clean);
    this.displayValue = formatted;

    // Restore cursor position after masking
    const selectionEnd = input.selectionEnd ?? formatted.length;
    requestAnimationFrame(() => {
      input.value = formatted;
      const diff = formatted.length - raw.length;
      const newPos = Math.max(0, selectionEnd + diff);
      input.setSelectionRange(newPos, newPos);
    });

    // Validate: need body (at least 7 digits) + DV
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    const isComplete = body.length >= 7;

    if (isComplete) {
      const expectedDv = calcDv(body);
      this.state = expectedDv === dv ? 'valid' : 'invalid';
      this.validChange.emit(this.state === 'valid');
    } else {
      this.state = 'idle';
      this.validChange.emit(false);
    }

    this.valueChange.emit(formatted);
    this.cdr.markForCheck();
  }
}
