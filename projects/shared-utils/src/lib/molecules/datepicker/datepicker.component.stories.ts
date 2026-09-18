import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from './datepicker.component';
import { LabelComponent } from '../../atoms/label/label.component';

// Reemplaza AtomicDatepickerComponent (publicador-facturas), que dependía de
// NgbInputDatepicker (@ng-bootstrap/ng-bootstrap) — calendario propio, sin
// librería externa. Desktop: popup. Mobile (<700px, ver ViewportService):
// bottom-sheet deslizante, mismo criterio que AppDrawerComponent del portal.
const meta: Meta<DatepickerComponent> = {
  title: 'shared-utils/molecules/Datepicker',
  component: DatepickerComponent,
  decorators: [moduleMetadata({ imports: [DatepickerComponent, LabelComponent, FormsModule] })],
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<DatepickerComponent>;

export const ConLabel: Story = {
  render: () => ({
    props: { value: '' },
    template: `
      <div style="min-height:420px; background:#0D1655; padding:24px;">
        <app-label text="Fecha Emisión" style="max-width:280px; display:block;">
          <app-datepicker [(ngModel)]="value" />
        </app-label>
      </div>
    `,
  }),
};

export const ConValorYLimites: Story = {
  name: 'Con valor y minDate/maxDate',
  render: () => ({
    props: { value: '2026-09-15' },
    template: `
      <div style="min-height:420px; background:#0D1655; padding:24px;">
        <app-datepicker [(ngModel)]="value" minDate="2026-09-01" maxDate="2026-09-25"
                        style="max-width:280px; display:block;" />
      </div>
    `,
  }),
};

export const ConError: Story = {
  args: { hasError: true },
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <div style="min-height:420px; background:#0D1655; padding:24px;">
        <app-datepicker [(ngModel)]="value" [hasError]="hasError" style="max-width:280px; display:block;" />
      </div>
    `,
  }),
};
