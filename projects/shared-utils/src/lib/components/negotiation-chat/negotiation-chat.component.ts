import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';
import { ChatMessage, ChatMessageStatus } from '../../services/types/chat.type';
import { ChatService } from '../../services/chat/chat.service';
import { FacturaType, OfertaDetalleType, ofertaEstado } from '../../services/types/factura.type';
import { FacturasService } from '../../services/facturas/factura.service';
import { UserStateService } from '../../services/states/userstate.service';

@Component({
  selector: 'app-negotiation-chat',
  templateUrl: './negotiation-chat.component.html',
  styleUrl: './negotiation-chat.component.scss',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NegotiationChatComponent implements OnInit, OnDestroy {
  @Input() ofertaId!: string;
  @Input() oferta: OfertaDetalleType | null = null;
  @Input() factura: FacturaType | null = null;
  @Input() isClient = true;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly acceptar = new EventEmitter<OfertaDetalleType>();
  @Output() readonly ofertaRechazada = new EventEmitter<string>();

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('msgInput') msgInput?: ElementRef<HTMLTextAreaElement>;

  messages: ChatMessage[] = [];
  isLoadingHistory = true;
  historyError = '';
  nextCursor: string | null = null;
  isLoadingMore = false;

  contextExpanded = true;
  inputText = '';
  isSending = false;
  isAtBottom = true;
  newMessageCount = 0;

  showRejectForm = false;
  rejectMotivo = '';
  isRejecting = false;
  rejectError = '';

  readonly ChatMessageStatus = ChatMessageStatus;

  private currentUserId = '';

  private readonly chatService = inject(ChatService);
  private readonly facturasService = inject(FacturasService);
  private readonly userStateService = inject(UserStateService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Arrow function preserves 'this' when used as WS handler
  private readonly onNewMessage = (payload: unknown): void => {
    const raw = payload as ChatMessage;
    const msg: ChatMessage = { ...raw, timestamp: new Date(raw.timestamp) };
    this.messages = [...this.messages, msg];
    if (this.isAtBottom) {
      setTimeout(() => this.scrollToBottom(), 50);
    } else {
      this.newMessageCount++;
    }
    this.chatService.markRead(this.ofertaId);
    this.cdr.markForCheck();
  };

  ngOnInit(): void {
    this.currentUserId = this.userStateService.state().id;

    const stored = localStorage.getItem(`chat_ctx_${this.ofertaId}`);
    if (stored === null) {
      this.contextExpanded = true;
    } else {
      this.contextExpanded = stored === 'true';
    }

    this.chatService.joinChannel(this.ofertaId, this.onNewMessage);
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.chatService.leaveChannel(this.ofertaId);
  }

  private loadHistory(): void {
    this.isLoadingHistory = true;
    this.historyError = '';

    this.chatService.getHistorial(this.ofertaId).then(resp => {
      this.messages = resp.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp as string) }));
      this.nextCursor = resp.nextCursor;

      const stored = localStorage.getItem(`chat_ctx_${this.ofertaId}`);
      if (stored === null && this.messages.length > 0) {
        this.contextExpanded = false;
        localStorage.setItem(`chat_ctx_${this.ofertaId}`, 'false');
      }

      this.chatService.markRead(this.ofertaId);
      this.isLoadingHistory = false;
      setTimeout(() => this.scrollToBottom(), 80);
      this.cdr.markForCheck();
    }).catch(() => {
      this.historyError = 'No se pudo cargar el historial.';
      this.isLoadingHistory = false;
      this.cdr.markForCheck();
    });
  }

  loadMoreHistory(): void {
    if (!this.nextCursor || this.isLoadingMore) {
      return;
    }
    this.isLoadingMore = true;
    const container = this.scrollContainer?.nativeElement;
    const heightBefore = container?.scrollHeight ?? 0;

    this.chatService.getHistorial(this.ofertaId, this.nextCursor).then(resp => {
      const older = resp.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp as string) }));
      this.messages = [...older, ...this.messages];
      this.nextCursor = resp.nextCursor;
      this.isLoadingMore = false;
      setTimeout(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - heightBefore;
        }
        this.cdr.markForCheck();
      }, 0);
    }).catch(() => {
      this.isLoadingMore = false;
      this.cdr.markForCheck();
    });
  }

  onScroll(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) {
      return;
    }
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    this.isAtBottom = atBottom;
    if (atBottom) {
      this.newMessageCount = 0;
    }
    if (el.scrollTop < 60 && this.nextCursor && !this.isLoadingMore) {
      this.loadMoreHistory();
    }
  }

  scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
      this.isAtBottom = true;
      this.newMessageCount = 0;
    }
  }

  toggleContext(): void {
    this.contextExpanded = !this.contextExpanded;
    localStorage.setItem(`chat_ctx_${this.ofertaId}`, String(this.contextExpanded));
  }

  onInputChange(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    this.inputText = ta.value;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`;
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isSending) {
      return;
    }
    this.isSending = true;
    this.inputText = '';
    if (this.msgInput?.nativeElement) {
      this.msgInput.nativeElement.style.height = 'auto';
    }
    this.chatService.enviarMensaje(this.ofertaId, text).then(msg => {
      this.messages = [...this.messages, msg];
      this.isSending = false;
      setTimeout(() => this.scrollToBottom(), 50);
      this.cdr.markForCheck();
    }).catch(() => {
      this.isSending = false;
      this.cdr.markForCheck();
    });
  }

  openRejectForm(): void {
    this.showRejectForm = true;
    this.rejectMotivo = '';
    this.rejectError = '';
  }

  cancelReject(): void {
    this.showRejectForm = false;
    this.rejectMotivo = '';
    this.rejectError = '';
  }

  async confirmarRechazar(): Promise<void> {
    if (!this.oferta) {
      return;
    }
    this.isRejecting = true;
    this.rejectError = '';
    try {
      await this.facturasService.rechazarOferta(this.ofertaId, this.rejectMotivo || undefined);
      this.showRejectForm = false;
      this.ofertaRechazada.emit(this.ofertaId);
    } catch {
      this.rejectError = 'Error al rechazar la oferta. Intente nuevamente.';
    } finally {
      this.isRejecting = false;
    }
  }

  onAceptar(): void {
    if (this.oferta) {
      this.acceptar.emit(this.oferta);
    }
  }

  onRejectMotivoChange(event: Event): void {
    this.rejectMotivo = (event.target as HTMLTextAreaElement).value;
  }

  close(): void {
    this.closed.emit();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  get isOfertaActiva(): boolean {
    return this.oferta?.estado === ofertaEstado.ACTIVA;
  }

  get interlocutorNombre(): string {
    return this.isClient
      ? (this.oferta?.ejecutivoNombre ?? '')
      : (this.factura?.nombre_cliente_cedente ?? '');
  }

  get interlocutorAvatarUrl(): string | undefined {
    return this.isClient ? this.oferta?.ejecutivoAvatarUrl : undefined;
  }

  get interlocutorSubtitle(): string {
    return this.isClient ? (this.oferta?.financieraNombre ?? '') : '';
  }

  getDiasRestantes(fechaVigencia: Date | string): number {
    const diff = new Date(fechaVigencia).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isMine(msg: ChatMessage): boolean {
    return msg.senderId === this.currentUserId || msg.senderId === 'me';
  }

  isSystemMessage(msg: ChatMessage): boolean {
    return msg.type !== 'text';
  }

  getSystemLabel(msg: ChatMessage): string {
    const labels: Record<string, string> = {
      'system:offer_sent': 'Oferta enviada',
      'system:offer_accepted': 'Oferta aceptada',
      'system:offer_rejected': 'Oferta rechazada',
      'system:offer_expired': 'Esta oferta venció sin ser aceptada',
    };
    const label = labels[msg.type] ?? msg.type;
    if (msg.motivo && msg.type === 'system:offer_rejected') {
      return `${label}: ${msg.motivo}`;
    }
    return label;
  }

  getSystemClass(type: string): string {
    if (type === 'system:offer_accepted') {
      return 'system-success';
    }
    if (type === 'system:offer_rejected') {
      return 'system-error';
    }
    if (type === 'system:offer_expired') {
      return 'system-warning';
    }
    return 'system-default';
  }

  formatTime(timestamp: Date | string): string {
    const d = new Date(timestamp);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  getDateLabel(timestamp: Date | string): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  isSameDay(a: Date | string, b: Date | string): boolean {
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate();
  }

  trackByMessageId(_i: number, msg: ChatMessage): string {
    return msg.messageId;
  }

  formatCLP(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(value);
  }
}
