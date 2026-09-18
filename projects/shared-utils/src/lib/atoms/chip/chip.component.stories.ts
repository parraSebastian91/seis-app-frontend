import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChipComponent } from './chip.component';
import { IconComponent } from '../icon/icon.component';

// Extraído de user-profile/view.component.html: .company-chip (marca, no
// removible) y .social-chip (neutro, clickeable + botón de eliminar) —
// reemplaza <mat-chip-set>/<mat-chip> de Angular Material.
const meta: Meta<ChipComponent> = {
  title: 'shared-utils/atoms/Chip',
  component: ChipComponent,
  decorators: [moduleMetadata({ imports: [ChipComponent, IconComponent] })],
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'brand'] },
    clickable: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<ChipComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap; background:#0D1655; padding:16px;">
        <app-chip variant="brand">
          <app-icon name="account_circle" />
          <span>usuario123</span>
        </app-chip>
        <app-chip variant="neutral" [clickable]="true">
          <app-icon name="link" />
          <span>LinkedIn</span>
        </app-chip>
        <app-chip variant="neutral" [clickable]="true" [removable]="true" removeLabel="Eliminar Twitter">
          <app-icon name="link" />
          <span>Twitter/X</span>
        </app-chip>
      </div>
    `,
  }),
};
