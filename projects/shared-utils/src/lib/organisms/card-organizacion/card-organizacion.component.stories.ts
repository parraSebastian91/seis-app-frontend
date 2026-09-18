import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CardOrganizacionComponent } from './card-organizacion.component';

// Fase 2: avatar -> <app-avatar>, contador -> <app-badge> (antes
// .badge-contador con background-color: #3a506b hardcodeado).
const meta: Meta<CardOrganizacionComponent> = {
  title: 'shared-utils/organisms/CardOrganizacion',
  component: CardOrganizacionComponent,
  decorators: [moduleMetadata({ imports: [CardOrganizacionComponent] })],
};
export default meta;

type Story = StoryObj<CardOrganizacionComponent>;

export const Default: Story = {
  args: {
    organizacion: {
      razon_social: 'Distribuidora Andina SpA',
      rut: '76.123.456-7',
      totalFacturas: 12,
    },
  },
};
