import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CardColaboradorComponent } from './card-colaborador.component';

// Fase 2: el avatar ahora es <app-avatar> (ver shared-utils/atoms/Avatar) en
// vez de imagen+iniciales reinventado a mano — ver diff de este mismo commit.
const meta: Meta<CardColaboradorComponent> = {
  title: 'shared-utils/organisms/CardColaborador',
  component: CardColaboradorComponent,
  decorators: [moduleMetadata({ imports: [CardColaboradorComponent] })],
};
export default meta;

type Story = StoryObj<CardColaboradorComponent>;

export const ConIniciales: Story = {
  args: {
    colaborador: {
      id: 1,
      nombre: 'Ana',
      apellido: 'Torres',
      cargo: 'Ejecutiva de Factoring',
      grupoNombre: 'Equipo Norte',
    },
  },
};

export const ConAvatar: Story = {
  args: {
    colaborador: {
      id: 2,
      nombre: 'Juan',
      apellido: 'Pérez',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      cargo: 'Operador',
    },
  },
};
