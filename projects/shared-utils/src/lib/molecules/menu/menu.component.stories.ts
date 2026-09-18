import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';

// Reemplaza <mat-menu>+matMenuTriggerFor+mat-menu-item (admin-miembros,
// admin-grupos) — data-driven: se pasa un array de MenuItem en vez de
// declarar el panel como contenido fijo del template.
const meta: Meta<MenuComponent> = {
  title: 'shared-utils/molecules/Menu',
  component: MenuComponent,
  decorators: [moduleMetadata({ imports: [MenuComponent, IconComponent, IconButtonComponent] })],
};
export default meta;

type Story = StoryObj<MenuComponent>;

export const Default: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Editar', icon: 'edit', action: () => alert('Editar') },
        { label: 'Ver miembros', icon: 'people', action: () => alert('Ver miembros') },
        { label: 'Eliminar', icon: 'delete_outline', danger: true, dividerBefore: true, action: () => alert('Eliminar') },
      ],
    },
    template: `
      <div style="padding:80px; background:#0D1655;">
        <app-menu [items]="items">
          <button app-icon-button size="sm" aria-label="Opciones">
            <app-icon name="more_vert" />
          </button>
        </app-menu>
      </div>
    `,
  }),
};

export const AlineadoAlInicio: Story = {
  name: 'align="start"',
  render: () => ({
    props: {
      items: [
        { label: 'Cambiar rol', icon: 'manage_accounts', action: () => alert('Cambiar rol') },
        { label: 'Remover', icon: 'person_remove', danger: true, action: () => alert('Remover') },
      ],
    },
    template: `
      <div style="padding:80px; background:#0D1655;">
        <app-menu [items]="items" align="start">
          <button app-icon-button size="sm" aria-label="Opciones">
            <app-icon name="more_vert" />
          </button>
        </app-menu>
      </div>
    `,
  }),
};
