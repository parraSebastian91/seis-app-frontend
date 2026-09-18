import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LabelComponent } from './label.component';

const meta: Meta<LabelComponent> = {
  title: 'shared-utils/atoms/Label',
  component: LabelComponent,
  decorators: [moduleMetadata({ imports: [LabelComponent] })],
  argTypes: {
    text: { control: 'text' },
    required: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<LabelComponent>;

export const ConInput: Story = {
  args: { text: 'RUT Deudor', required: true },
  render: (args) => ({
    props: args,
    template: `
      <app-label [text]="text" [required]="required" style="max-width:280px; display:block;">
        <input type="text" placeholder="12.345.678-9" style="width:100%;" />
      </app-label>
    `,
  }),
};
