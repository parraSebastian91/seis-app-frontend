import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './select.component';
import { LabelComponent } from '../label/label.component';

// Reemplaza <mat-select>+<mat-option> — 5 usos reales (user-profile/view,
// org-profile, admin-solicitudes, admin-miembros, admin-grupos), ninguno con
// búsqueda ni multi-selección.
const meta: Meta<SelectComponent> = {
  title: 'shared-utils/atoms/Select',
  component: SelectComponent,
  decorators: [moduleMetadata({ imports: [SelectComponent, LabelComponent, FormsModule] })],
  argTypes: {
    hasError: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<SelectComponent>;

export const ConLabel: Story = {
  render: () => ({
    props: { value: 'LinkedIn' },
    template: `
      <app-label text="Red social" style="max-width:280px; display:block;">
        <app-select [(ngModel)]="value">
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter/X">Twitter/X</option>
          <option value="Sitio Web">Sitio Web</option>
        </app-select>
      </app-label>
    `,
  }),
};

export const ConError: Story = {
  args: { hasError: true },
  render: (args) => ({
    props: args,
    template: `
      <app-select [hasError]="hasError" style="max-width:280px; display:block;">
        <option value="">Selecciona un rol</option>
        <option value="admin">Administrador</option>
        <option value="miembro">Miembro</option>
      </app-select>
    `,
  }),
};
