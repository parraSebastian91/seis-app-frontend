import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormFieldComponent, FormFieldErrorDirective } from './form-field.component';
import { InputComponent } from '../../atoms/input/input.component';

// Reemplaza <mat-form-field>+<mat-label>+<mat-error> — 6 archivos del
// workspace (user-profile/view, admin-miembros, admin-solicitudes,
// admin-grupo-detalle, admin-grupos, org-profile).
const meta: Meta<FormFieldComponent> = {
  title: 'shared-utils/molecules/FormField',
  component: FormFieldComponent,
  decorators: [
    moduleMetadata({ imports: [FormFieldComponent, FormFieldErrorDirective, InputComponent] }),
  ],
};
export default meta;

type Story = StoryObj<FormFieldComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; background:#0D1655; padding:16px; width:280px;">
        <app-form-field label="Nombres">
          <app-input placeholder="Juan" />
        </app-form-field>

        <app-form-field label="Correo" required>
          <app-input type="email" [hasError]="true" />
          <span form-field-error>Formato de email inválido</span>
        </app-form-field>
      </div>
    `,
  }),
};
