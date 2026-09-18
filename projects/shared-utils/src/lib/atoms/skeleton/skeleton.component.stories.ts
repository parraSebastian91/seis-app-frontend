import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

// Reemplaza las implementaciones ad-hoc de shimmer/pulse duplicadas en
// Card, kpi-card, pipeline-summary, cartera-activa-summary, my-offers-table
// y kpis-factura-header. Un átomo, N composiciones por consumidor.
const meta: Meta<SkeletonComponent> = {
  title: 'shared-utils/atoms/Skeleton',
  component: SkeletonComponent,
  decorators: [moduleMetadata({ imports: [SkeletonComponent] })],
  argTypes: {
    variant: { control: 'select', options: ['text', 'rect', 'circle'] },
  },
};
export default meta;

type Story = StoryObj<SkeletonComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; background:#0D1655; padding:16px; width:280px;">
        <app-skeleton width="55%" height="22px" />
        <app-skeleton width="35%" height="13px" />
        <app-skeleton />
        <app-skeleton width="78%" />
        <app-skeleton width="48%" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:16px; background:#0D1655; padding:16px;">
        <app-skeleton variant="circle" width="40px" height="40px" />
        <div style="display:flex; flex-direction:column; gap:8px; flex:1;">
          <app-skeleton variant="text" width="60%" />
          <app-skeleton variant="text" width="40%" />
        </div>
      </div>
      <div style="background:#0D1655; padding:16px;">
        <app-skeleton variant="rect" height="110px" />
      </div>
    `,
  }),
};

export const CardComposition: Story = {
  name: 'Composición tipo Card',
  render: () => ({
    template: `
      <div style="width:320px; background:#1A237E; border-radius:12px; padding:18px 20px; display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <app-skeleton width="55%" height="22px" />
          <app-skeleton width="35%" height="13px" />
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <app-skeleton />
          <app-skeleton width="78%" />
          <app-skeleton />
          <app-skeleton width="48%" />
        </div>
        <div style="display:flex; gap:10px;">
          <app-skeleton variant="rect" width="88px" height="34px" />
          <app-skeleton variant="rect" width="88px" height="34px" />
        </div>
      </div>
    `,
  }),
};
