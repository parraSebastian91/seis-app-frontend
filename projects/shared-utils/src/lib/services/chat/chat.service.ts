import { inject, Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotificationSocketService } from '../websocket/notification.socket.service';
import { USER_PROFILE_SERVICE_CONFIG, UserProfileServiceConfig } from '../UserProfile/userProfile.service';
import { ChatHistoryResponse, ChatMessage, ChatMessageStatus } from '../types/chat.type';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly socketService = inject(NotificationSocketService);

  private readonly messageHandlers = new Map<string, (payload: unknown) => void>();
  private readonly joinedChannels = new Set<string>();

  constructor(
    @Optional() @Inject(USER_PROFILE_SERVICE_CONFIG) private readonly config?: UserProfileServiceConfig
  ) {}

  private get apiBase(): string {
    return this.config?.apiBase ?? '';
  }

  async getHistorial(ofertaId: string, cursor?: string): Promise<ChatHistoryResponse> {
    let url = `${this.apiBase}/api/bff/oferta/${ofertaId}/mensajes`;
    if (cursor) {
      url += `?cursor=${encodeURIComponent(cursor)}`;
    }
    try {
      return await firstValueFrom(
        this.http.get<ChatHistoryResponse>(url)
      );
    } catch {
      return { messages: [], nextCursor: null };
    }
  }

  joinChannel(ofertaId: string, onMessage: (payload: unknown) => void): void {
    if (this.joinedChannels.has(ofertaId)) {
      return;
    }
    this.joinedChannels.add(ofertaId);
    this.messageHandlers.set(ofertaId, onMessage);
    this.socketService.sendMessage(`join:offer:${ofertaId}`, {});
    this.socketService.onMessage(`message:offer:${ofertaId}`, onMessage);
  }

  leaveChannel(ofertaId: string): void {
    if (!this.joinedChannels.has(ofertaId)) {
      return;
    }
    const handler = this.messageHandlers.get(ofertaId);
    this.socketService.offMessage(`message:offer:${ofertaId}`, handler);
    this.socketService.sendMessage(`leave:offer:${ofertaId}`, {});
    this.joinedChannels.delete(ofertaId);
    this.messageHandlers.delete(ofertaId);
  }

  markRead(ofertaId: string): void {
    this.socketService.sendMessage(`read:offer:${ofertaId}`, {});
  }

  async enviarMensaje(ofertaId: string, content: string): Promise<ChatMessage> {
    const optimistic: ChatMessage = {
      messageId: `local-${Date.now()}`,
      ofertaId,
      senderId: 'me',
      senderName: 'Tú',
      content,
      type: 'text',
      status: ChatMessageStatus.SENT,
      timestamp: new Date()
    };
    this.socketService.sendMessage(`message:offer:${ofertaId}`, { content });
    return optimistic;
  }
}
