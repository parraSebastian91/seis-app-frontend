/*
 * Public API Surface of shared-utils
 */

export * from './lib/theme/theme.service';
export * from './lib/theme/theme.interface';
export * from './lib/interceptors/correlation-id.interceptor';
export * from './lib/services/UserProfile/userProfile.service';
export * from './lib/services/objectUpload/objectUpload.service';
export * from './lib/services/states/userstate.service';
export * from './lib/services/layout/layout-state.service';
export * from './lib/services/layout/viewport.service';
export * from './lib/services/notifications/notification-center.service';
export * from './lib/services/websocket/notification.socket.service';

export * from './lib/services/types/api-response.model';
export * from './lib/services/types/SidebarMenu.type';
export * from './lib/services/types/userOrgProfile.type';
export * from './lib/services/types/userProfile.type';
export * from './lib/services/types/imageProfile.type';
export * from './lib/services/types/states/userImageState.type';
export * from './lib/services/types/states/userOrgProfile.type';
export * from './lib/services/types/states/UserState.type';
export * from './lib/services/upload-modal/upload-modal.service';
export * from './lib/services/types/constantes.type';
export * from './lib/services/facturas/factura.service';
export * from './lib/services/types/factura.type';

// Session & models (HU-13)
export * from './lib/models/user.model';
export * from './lib/models/organization.model';
export * from './lib/models/session.model';
export * from './lib/services/session/session.service';

// HTTP interceptors & tokens (HU-14)
export * from './lib/tokens/auth.tokens';
export * from './lib/interceptors/credentials.interceptor';
export * from './lib/interceptors/auth-refresh.interceptor';
export * from './lib/interceptors/error.interceptor';
export * from './lib/services/auth/auth-refresh.service';
export * from './lib/services/error/app-error.service';

// OCR notes (HU-24 / HU-28)
export * from './lib/types/ocr-nota.type';
export * from './lib/components/ocr-notes-list/ocr-notes-list.component';

// Chat (HU-26)
export * from './lib/services/types/chat.type';
export * from './lib/services/chat/chat.service';
export * from './lib/components/negotiation-chat/negotiation-chat.component';

// SearchableCardSelect (HU-35)
export * from './lib/components/searchable-card-select/searchable-card-item.type';
export * from './lib/components/searchable-card-select/searchable-card-select.component';

// RutInput + PasswordStrengthMeter (HU-38)
export * from './lib/components/rut-input/rut-input.component';
export * from './lib/components/password-strength-meter/password-strength-meter.component';

// Generic Drawer
export * from './lib/services/drawer/drawer.service';
export * from './lib/services/drawer/drawer.types';
