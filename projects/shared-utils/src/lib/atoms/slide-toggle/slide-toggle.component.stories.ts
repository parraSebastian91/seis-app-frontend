import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SlideToggleComponent } from './slide-toggle.component';

// Extraído de org-wizard.component.html (.toggle-switch, usado 6 veces ahí:
// notificaciones, "opera en otras regiones", "firma digital").
const meta: Meta<SlideToggleComponent> = {
  title: 'shared-utils/atoms/SlideToggle',
  component: SlideToggleComponent,
  decorators: [moduleMetadata({ imports: [SlideToggleComponent] })],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<SlideToggleComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; background:#0D1655; padding:16px; color:#fff;">
        <app-slide-toggle>Notificaciones por email</app-slide-toggle>
        <app-slide-toggle [checked]="true">Firma contratos digitalmente</app-slide-toggle>
        <app-slide-toggle [disabled]="true">Deshabilitado</app-slide-toggle>
      </div>
    `,
  }),
};
