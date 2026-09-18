import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LoaderComponent } from './loader.component';

// Reemplaza <mat-spinner> — 33 usos encontrados en el workspace, tamaños
// 16-52px, mayormente inline en botones (.btn-spinner, 16-18px).
const meta: Meta<LoaderComponent> = {
  title: 'shared-utils/atoms/Loader',
  component: LoaderComponent,
  decorators: [moduleMetadata({ imports: [LoaderComponent] })],
  argTypes: {
    size: { control: 'number' },
    color: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<LoaderComponent>;

export const Tamaños: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:16px; align-items:center; color:#00BFA5;">
        <app-loader [size]="16" />
        <app-loader [size]="24" />
        <app-loader [size]="36" />
        <app-loader [size]="48" />
      </div>
    `,
  }),
};

/** Caso real: inline dentro de un botón, hereda el color del texto (blanco). */
export const DentroDeBoton: Story = {
  render: () => ({
    template: `
      <button style="display:inline-flex; align-items:center; gap:8px; background:#00BFA5; color:#0A0D1A; border:none; border-radius:8px; padding:10px 16px; font-weight:700;">
        <app-loader [size]="16" />
        Guardando…
      </button>
    `,
  }),
};
