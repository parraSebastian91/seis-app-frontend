export type ChatMessageType =
  | 'text'
  | 'system:offer_sent'
  | 'system:offer_accepted'
  | 'system:offer_rejected'
  | 'system:offer_expired';

export enum ChatMessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export interface ChatMessage {
  messageId: string;
  ofertaId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: ChatMessageType;
  status: ChatMessageStatus;
  timestamp: Date | string;
  motivo?: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
}
