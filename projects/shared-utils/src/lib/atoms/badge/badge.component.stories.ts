import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

// =============================================================================
// Reemplaza los `.rol-chip`/`.badge` reinventados a mano en 13+ archivos
// (org-gestor, ofertador-facturas, dashboard-facturas, navbar — ver
// auditoría de estilos). Antes cada uno definía su propio shape/colores
// hardcodeados; ahora es un solo componente sobre los tokens de estado.
// =============================================================================
const meta: Meta<BadgeComponent> = {
  title: 'shared-utils/atoms/Badge',
  component: BadgeComponent,
  decorators: [moduleMetadata({ imports: [BadgeComponent] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'brand', 'neutral'],
    },
    color: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<BadgeComponent>;

export const TodosLosVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <app-badge variant="success">Aprobado</app-badge>
        <app-badge variant="warning">Pendiente</app-badge>
        <app-badge variant="error">Rechazado</app-badge>
        <app-badge variant="info">Operador</app-badge>
        <app-badge variant="brand">Colaborador</app-badge>
        <app-badge variant="neutral">Expirado</app-badge>
      </div>
    `,
  }),
};

/** Caso "auditor": color de rol sin token de estado propio → escape hatch `color`. */
export const ColorPersonalizado: Story = {
  args: { color: '#A78BFA' },
  render: (args) => ({
    props: args,
    template: `<app-badge [color]="color">Auditor</app-badge>`,
  }),
};
