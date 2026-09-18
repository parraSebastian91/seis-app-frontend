import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { ICON_REGISTRY } from './icon-registry';

// Reemplaza <mat-icon> — sin @angular/material, sin depender de la fuente de
// íconos (Material Icons/Symbols vía Google Fonts). Mismos ~98 nombres que
// ya usaban las 20 plantillas con <mat-icon>, migrados desde Material
// Symbols SVG (Apache-2.0, fonts.gstatic.com).
const meta: Meta<IconComponent> = {
  title: 'shared-utils/atoms/Icon',
  component: IconComponent,
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  argTypes: {
    name: { control: 'select', options: Object.keys(ICON_REGISTRY) },
    size: { control: 'number' },
  },
};
export default meta;

type Story = StoryObj<IconComponent>;

export const Default: Story = {
  args: { name: 'close', size: 24 },
};

/** Los 98 íconos migrados, para ver de un vistazo si alguno quedó mal. */
export const TodoElSet: Story = {
  render: () => ({
    template: `
      <div style="display:grid; grid-template-columns: repeat(10, 1fr); gap:12px; color:#fff; background:#0D1655; padding:16px;">
        ${Object.keys(ICON_REGISTRY)
          .map(
            (n) => `
          <div style="display:flex; flex-direction:column; align-items:center; gap:4px; font-size:9px;">
            <app-icon name="${n}" size="24" />
            <span style="opacity:.6; text-align:center;">${n}</span>
          </div>`
          )
          .join('')}
      </div>
    `,
  }),
};
