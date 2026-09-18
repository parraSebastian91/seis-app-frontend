import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SearchableCardSelectComponent } from './searchable-card-select.component';

// Es el select con búsqueda del top-navbar del portal (OrganizationSelectorComponent
// es un wrapper de negocio delgado sobre este mismo componente — ver
// contenedor/componentes/top-navbar/organization-selector).
// Fase 2: el avatar de cada ítem ahora es <app-avatar> (antes .sc-avatar
// manual con su propio manejo de imagen rota, duplicado con
// CardColaborador/CardOrganizacion).
const meta: Meta<SearchableCardSelectComponent> = {
  title: 'shared-utils/organisms/SearchableCardSelect',
  component: SearchableCardSelectComponent,
  decorators: [moduleMetadata({ imports: [SearchableCardSelectComponent] })],
};
export default meta;

type Story = StoryObj<SearchableCardSelectComponent>;

const items = [
  { id: '1', name: 'Distribuidora Andina SpA', meta: '76.123.456-7' },
  { id: '2', name: 'Factor Norte Ltda', meta: '77.987.654-3', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Comercial del Sur SA', meta: '78.222.333-1' },
];

export const Cerrado: Story = {
  args: { items, selectedId: '2', placeholder: 'Selecciona una organización' },
};
