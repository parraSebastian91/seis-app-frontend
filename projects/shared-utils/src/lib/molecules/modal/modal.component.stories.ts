import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ModalComponent, ModalTitleDirective, ModalActionsDirective } from './modal.component';

// =============================================================================
// Reemplaza el patrón `.modal-backdrop`/`.modal-panel` reinventado a mano en
// 9 archivos (org-gestor ×4, modal-upload-object, modal-publicacion-factura,
// admin-solicitudes — ver auditoría de estilos).
// =============================================================================
const meta: Meta<ModalComponent> = {
  title: 'shared-utils/molecules/Modal',
  component: ModalComponent,
  decorators: [
    moduleMetadata({ imports: [ModalComponent, ModalTitleDirective, ModalActionsDirective] }),
  ],
  argTypes: {
    open: { control: 'boolean' },
    maxWidth: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<ModalComponent>;

export const Confirmacion: Story = {
  args: { open: true, maxWidth: '440px' },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open" [maxWidth]="maxWidth">
        <div modal-title>Eliminar miembro</div>
        <p>Esta acción no se puede deshacer. ¿Confirmás que querés eliminar a este miembro de la organización?</p>
        <div modal-actions>
          <button>Cancelar</button>
          <button>Eliminar</button>
        </div>
      </app-modal>
    `,
  }),
};

export const SinTitulo: Story = {
  args: { open: true },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open">
        <p>Modal sin header — solo body. El botón de cerrar no aparece porque no hay <code>modal-title</code>.</p>
      </app-modal>
    `,
  }),
};
