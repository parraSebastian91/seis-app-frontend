import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

const meta: Meta<AvatarComponent> = {
  title: 'shared-utils/atoms/Avatar',
  component: AvatarComponent,
  decorators: [moduleMetadata({ imports: [AvatarComponent] })],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<AvatarComponent>;

export const ConIniciales: Story = {
  args: { name: 'Ana Torres', size: 'md' },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <app-avatar [name]="name" size="sm" />
        <app-avatar [name]="name" size="md" />
        <app-avatar [name]="name" size="lg" />
      </div>
    `,
  }),
};

export const ConImagen: Story = {
  args: { src: 'https://i.pravatar.cc/150?img=12', name: 'Ana Torres', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<app-avatar [src]="src" [name]="name" [size]="size" />`,
  }),
};
