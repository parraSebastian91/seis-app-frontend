import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconButtonComponent } from './icon-button.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<IconButtonComponent> = {
  title: 'shared-utils/atoms/IconButton',
  component: IconButtonComponent,
  decorators: [moduleMetadata({ imports: [IconButtonComponent, IconComponent] })],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<IconButtonComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; align-items:center;">
        <button app-icon-button size="lg" aria-label="Cerrar"><app-icon name="close" /></button>
        <button app-icon-button size="md" aria-label="Cerrar"><app-icon name="close" /></button>
        <button app-icon-button size="sm" aria-label="Cerrar"><app-icon name="close" /></button>
        <button app-icon-button size="md" aria-label="Cerrar" disabled><app-icon name="close" /></button>
      </div>
    `,
  }),
};
