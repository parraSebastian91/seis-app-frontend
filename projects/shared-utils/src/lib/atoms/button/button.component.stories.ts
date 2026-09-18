import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';

// =============================================================================
// Reemplaza `.btn-primary/secondary/light/danger` (y sus alias `.btn-aceptar`/
// `.btn-revisar`) reinventados con variables `--modal-*` locales en
// modal-publicacion-factura.component.scss y terms-and-conditions-modal.
// 40 usos de <button> encontrados solo en publicador-facturas/component.
// =============================================================================
const meta: Meta<ButtonComponent> = {
  title: 'shared-utils/atoms/Button',
  component: ButtonComponent,
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'light', 'danger'] },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const TodasLasVariantes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button app-button variant="primary">Guardar</button>
        <button app-button variant="secondary">Continuar</button>
        <button app-button variant="light">Cancelar</button>
        <button app-button variant="danger">Eliminar</button>
        <button app-button variant="primary" disabled>Deshabilitado</button>
      </div>
    `,
  }),
};
