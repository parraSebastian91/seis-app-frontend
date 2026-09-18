import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CardComponent, CardTitleDirective, CardFooterDirective } from './card.component';

// =============================================================================
// Historia de validación del pipeline Storybook — primer componente probado.
// CardComponent usa content-projection (card-title/card-content/card-footer)
// y variables CSS del design system (glowColor default = --color-brand-primary),
// así que si esto renderiza con el teal correcto, confirma que _tokens.scss
// (cargado vía seis-portal/src/styles.scss) llega hasta acá.
// =============================================================================
const meta: Meta<CardComponent> = {
  title: 'shared-utils/molecules/Card',
  component: CardComponent,
  decorators: [
    moduleMetadata({
      imports: [CardComponent, CardTitleDirective, CardFooterDirective],
    }),
  ],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    radius: { control: 'text' },
    padding: { control: 'text' },
    glowColor: { control: 'color' },
    loading: { control: 'boolean' },
    elevated: { control: 'boolean' },
    hoverLift: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<CardComponent>;

export const ConTituloYFooter: Story = {
  args: {
    width: '320px',
    elevated: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [width]="width" [height]="height" [radius]="radius"
                [padding]="padding" [glowColor]="glowColor" [loading]="loading"
                [elevated]="elevated" [hoverLift]="hoverLift">
        <div card-title><h3 class="text-h3">Factura #4821</h3></div>
        <div card-content>
          <p class="text-body">Emisor: Distribuidora Andina SpA</p>
          <p class="text-data-lg">$1.250.000</p>
        </div>
        <div card-footer>
          <button>Ver detalle</button>
        </div>
      </app-card>
    `,
  }),
};

export const SoloContenido: Story = {
  args: {
    width: '280px',
    padding: 'default',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [width]="width" [padding]="padding">
        <div card-content>
          <p class="text-body-sm">Card sin header ni footer — el body ocupa todo el espacio.</p>
        </div>
      </app-card>
    `,
  }),
};

export const Loading: Story = {
  args: {
    width: '320px',
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [width]="width" [loading]="loading" [glowColor]="glowColor">
        <div card-title><h3 class="text-h3">Factura #4821</h3></div>
        <div card-content><p class="text-body">Contenido oculto mientras loading=true</p></div>
        <div card-footer><button>Ver detalle</button></div>
      </app-card>
    `,
  }),
};

export const HoverLift: Story = {
  args: {
    width: '280px',
    hoverLift: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [width]="width" [hoverLift]="hoverLift">
        <div card-content><p class="text-body">Pasá el mouse — hoverLift activo.</p></div>
      </app-card>
    `,
  }),
};
