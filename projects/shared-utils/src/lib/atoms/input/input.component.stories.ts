import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputComponent, InputSuffixDirective } from './input.component';
import { LabelComponent } from '../label/label.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<InputComponent> = {
  title: 'shared-utils/atoms/Input',
  component: InputComponent,
  decorators: [
    moduleMetadata({
      imports: [InputComponent, LabelComponent, FormsModule, IconButtonComponent, IconComponent, InputSuffixDirective],
    }),
  ],
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'email', 'tel', 'password'] },
    hasError: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<InputComponent>;

export const ConLabel: Story = {
  args: { placeholder: '12.345.678-9' },
  render: (args) => ({
    props: args,
    template: `
      <app-label text="RUT Deudor" required style="max-width:280px; display:block;">
        <app-input [placeholder]="placeholder" [type]="type" [hasError]="hasError" />
      </app-label>
    `,
  }),
};

export const ConError: Story = {
  args: { placeholder: 'Monto', hasError: true },
  render: (args) => ({
    props: args,
    template: `<app-input [placeholder]="placeholder" [hasError]="hasError" style="max-width:280px; display:block;" />`,
  }),
};

export const ConSufijo: Story = {
  name: 'Con sufijo (toggle de contraseña)',
  render: () => ({
    props: { visible: false },
    template: `
      <app-input [type]="visible ? 'text' : 'password'" placeholder="Contraseña" style="max-width:280px; display:block;">
        <button input-suffix app-icon-button size="sm" type="button" (click)="visible = !visible"
                [attr.aria-label]="visible ? 'Ocultar' : 'Mostrar'">
          <app-icon [name]="visible ? 'visibility_off' : 'visibility'" />
        </button>
      </app-input>
    `,
  }),
};
