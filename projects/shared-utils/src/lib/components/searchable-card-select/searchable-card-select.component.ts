import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableCardItem } from './searchable-card-item.type';

@Component({
  selector: 'app-searchable-card-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './searchable-card-select.component.html',
  styleUrl: './searchable-card-select.component.scss',
})
export class SearchableCardSelectComponent implements OnDestroy {
  @Input() items: SearchableCardItem[] = [];
  @Input() selectedId: string | null = null;
  @Input() placeholder = 'Selecciona una opción';
  @Input() searchPlaceholder = 'Buscar...';
  /** Nombre del ícono Material (font de Material Icons debe estar cargada). */
  @Input() icon = 'business';

  @Output() readonly selectionChange = new EventEmitter<SearchableCardItem>();
  /** Emitido al hacer clic en el botón de acción (→) de un ítem. */
  @Output() readonly profileClick = new EventEmitter<SearchableCardItem>();

  isOpen = false;
  searchQuery = '';
  focusedIndex = -1;
  readonly brokenAvatarIds = new Set<string>();

  @ViewChild('searchInput') private readonly searchInputRef?: ElementRef<HTMLInputElement>;

  private readonly el = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private openTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    if (this.openTimer !== null) clearTimeout(this.openTimer);
  }

  get selectedItem(): SearchableCardItem | undefined {
    return this.items.find(i => i.id === this.selectedId);
  }

  get filteredItems(): SearchableCardItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(i => i.name.toLowerCase().includes(q));
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    this.isOpen = true;
    this.searchQuery = '';
    const idx = this.items.findIndex(i => i.id === this.selectedId);
    this.focusedIndex = idx >= 0 ? idx : -1;
    this.openTimer = setTimeout(() => {
      this.searchInputRef?.nativeElement.focus();
    }, 0);
  }

  close(): void {
    this.isOpen = false;
    this.searchQuery = '';
    this.focusedIndex = -1;
  }

  selectItem(item: SearchableCardItem): void {
    this.selectionChange.emit(item);
    this.close();
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.focusedIndex = -1;
  }

  onAvatarError(itemId: string): void {
    this.brokenAvatarIds.add(itemId);
    this.cdr.markForCheck();
  }

  showInitials(item: SearchableCardItem): boolean {
    return !item.avatarUrl || this.brokenAvatarIds.has(item.id);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  onProfileClick(event: MouseEvent, item: SearchableCardItem): void {
    event.stopPropagation();
    this.profileClick.emit(item);
    this.close();
  }

  /** Cierra el panel al hacer clic fuera del componente (CA-07). */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target as Node | null;
    if (target && !(this.el.nativeElement as HTMLElement).contains(target)) {
      this.close();
      this.cdr.markForCheck();
    }
  }

  /** Navegación por teclado (CA-08). */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;
    const len = this.filteredItems.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = len === 0 ? -1 : (this.focusedIndex + 1) % len;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = len === 0 ? -1 : (this.focusedIndex - 1 + len) % len;
        break;
      case 'Enter': {
        const item = this.filteredItems[this.focusedIndex];
        if (item) this.selectItem(item);
        break;
      }
      case 'Escape':
        this.close();
        break;
      default:
        break;
    }
  }
}
