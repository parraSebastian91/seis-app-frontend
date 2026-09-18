import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TooltipDirective } from './tooltip.directive';

// Reemplaza matTooltip — 9 usos reales (admin-solicitudes, user-profile/view,
// org-profile), todos strings cortos estáticos sobre icon-buttons.
const meta: Meta<TooltipDirective> = {
  title: 'shared-utils/directives/Tooltip',
  decorators: [moduleMetadata({ imports: [TooltipDirective] })],
};
export default meta;

type Story = StoryObj<TooltipDirective>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; padding:80px; background:#0D1655;">
        <button appTooltip="Copiar token" style="padding:8px 12px;">Arriba (hover 300ms)</button>
        <button appTooltip="Editar dirección" tooltipPosition="bottom" style="padding:8px 12px;">Abajo</button>
      </div>
    `,
  }),
};
