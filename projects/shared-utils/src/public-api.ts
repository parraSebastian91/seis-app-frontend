/*
 * Public API Surface of shared-utils
 */

export * from './lib/services/SSE/sse.service';
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
export * from './lib/organisms/ocr-notes-list/ocr-notes-list.component';

// Chat (HU-26)
export * from './lib/services/types/chat.type';
export * from './lib/services/chat/chat.service';

// Adjuntos (tipo atómico compartido entre MFEs)
export * from './lib/types/adjunto.type';
export * from './lib/organisms/adjuntos-list/adjuntos-list.component';
export * from './lib/organisms/negotiation-chat/negotiation-chat.component';

// SearchableCardSelect (HU-35)
export * from './lib/organisms/searchable-card-select/searchable-card-item.type';
export * from './lib/organisms/searchable-card-select/searchable-card-select.component';

// RutInput + PasswordStrengthMeter (HU-38)
export * from './lib/atoms/rut-input/rut-input.component';
export * from './lib/atoms/password-strength-meter/password-strength-meter.component';

// Generic Drawer
export * from './lib/services/drawer/drawer.service';
export * from './lib/services/drawer/drawer.types';

// Card Component
export * from './lib/molecules/card/card.component';
export { CardTitleDirective, CardFooterDirective } from './lib/molecules/card/card.component';

// Card Colaborador
export * from './lib/organisms/card-colaborador/card-colaborador.component';
export type { CardColaboradorData } from './lib/organisms/card-colaborador/card-colaborador.component';

// Card Organizacion
export * from './lib/organisms/card-organizacion/card-organizacion.component';
export type { CardOrganizacionData } from './lib/organisms/card-organizacion/card-organizacion.component';

// Expansion Panel (Acordeón)
export * from './lib/molecules/expancion-panel/expansion-panel.component';
export { PanelHeaderDirective, PanelContentDirective, PanelFooterDirective } from './lib/molecules/expancion-panel/expansion-panel.component';
export type { PanelAttentionVariant } from './lib/molecules/expancion-panel/expansion-panel.component';

// Badge (Fase 2 del refactor de design system — reemplaza .rol-chip/.badge duplicados)
export * from './lib/atoms/badge/badge.component';

// Modal (Fase 2 — reemplaza .modal-backdrop/.modal-panel duplicados)
export * from './lib/molecules/modal/modal.component';

// Button, IconButton, Input, Label (Fase 2 — analizados desde
// publicador-facturas/component: 40 <button>, 13 <input>, 15 <label> sueltos)
export * from './lib/atoms/button/button.component';
export * from './lib/atoms/icon-button/icon-button.component';
export * from './lib/atoms/input/input.component';
export * from './lib/atoms/label/label.component';

// Avatar (Fase 2 — imagen+iniciales duplicado en CardColaborador,
// CardOrganizacion y 9+ archivos más de los 4 MFEs)
export * from './lib/atoms/avatar/avatar.component';

// Icon (Fase 2 — reemplaza <mat-icon>/@angular/material sin depender de
// Angular Material ni de la fuente de íconos; mismos ~98 nombres ya en uso)
export * from './lib/atoms/icon/icon.component';
export * from './lib/atoms/icon/icon-registry';

// Loader (Fase 2 — reemplaza <mat-spinner>, 33 usos en el workspace)
export * from './lib/atoms/loader/loader.component';

// Checkbox y SlideToggle (Fase 2 — extraídos de org-wizard.component.html,
// que ya los tenía bien hechos en CSS puro; reemplazan MatCheckbox/MatSlideToggle)
export * from './lib/atoms/checkbox/checkbox.component';
export * from './lib/atoms/slide-toggle/slide-toggle.component';

// Skeleton (Fase 2 — reemplaza los shimmer/pulse ad-hoc duplicados en Card,
// kpi-card, pipeline-summary, cartera-activa-summary, my-offers-table y
// kpis-factura-header)
export * from './lib/atoms/skeleton/skeleton.component';

// Chip (Fase 2 — reemplaza <mat-chip-set>/<mat-chip> de user-profile/view:
// .company-chip tinte de marca, .social-chip neutro + matChipRemove)
export * from './lib/atoms/chip/chip.component';

// FormField (Fase 2 — reemplaza <mat-form-field>+<mat-label>+<mat-error>,
// usado en 6 archivos: user-profile/view, admin-miembros, admin-solicitudes,
// admin-grupo-detalle, admin-grupos, org-profile)
export * from './lib/molecules/form-field/form-field.component';

// Select (Fase 2 — reemplaza <mat-select>+<mat-option>, 5 usos reales:
// user-profile/view, org-profile, admin-solicitudes, admin-miembros,
// admin-grupos — ninguno con búsqueda ni multi-selección)
export * from './lib/atoms/select/select.component';

// Tooltip (Fase 2 — reemplaza matTooltip, 9 usos reales: admin-solicitudes,
// user-profile/view, org-profile; sin overlay/CDK, solo getBoundingClientRect)
export * from './lib/directives/tooltip.directive';

// Datepicker (Fase 2 — reemplaza AtomicDatepickerComponent/NgbInputDatepicker
// de publicador-facturas; calendario propio, popup en desktop y bottom-sheet
// en mobile vía ViewportService)
export * from './lib/molecules/datepicker/datepicker.component';

// NotificationBadge (Fase 2 — reemplaza matBadge/matBadgeColor de top-navbar,
// que necesitaba ::ng-deep + !important para el color de marca)
export * from './lib/atoms/notification-badge/notification-badge.component';

// Menu (Fase 2 — reemplaza <mat-menu>+matMenuTriggerFor+mat-menu-item,
// 2 usos reales: admin-miembros, admin-grupos. Data-driven vía [items])
export * from './lib/molecules/menu/menu.component';
