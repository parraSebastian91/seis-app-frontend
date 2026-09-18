import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

// Extraído de org-wizard.component.html (.checkbox-row, usado 3 veces ahí).
// MatCheckboxModule estaba importado en organization.module.ts pero SIN
// ningún <mat-checkbox> real en ningún template — import muerto.
const meta: Meta<CheckboxComponent> = {
  title: 'shared-utils/atoms/Checkbox',
  component: CheckboxComponent,
  decorators: [moduleMetadata({ imports: [CheckboxComponent] })],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:8px; background:#0D1655; padding:16px; color:#fff;">
        <app-checkbox>Sin marcar</app-checkbox>
        <app-checkbox [checked]="true">Marcado como dirección principal</app-checkbox>
        <app-checkbox [disabled]="true">Deshabilitado</app-checkbox>
        <app-checkbox [checked]="true" [disabled]="true">Deshabilitado + marcado</app-checkbox>
      </div>
    `,
  }),
};
