import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NotificationBadgeComponent } from './notification-badge.component';
import { IconComponent } from '../icon/icon.component';

// Reemplaza matBadge/matBadgeColor (top-navbar) — necesitaba ::ng-deep +
// !important para pintarlo con el color de marca en vez del de Material.
const meta: Meta<NotificationBadgeComponent> = {
  title: 'shared-utils/atoms/NotificationBadge',
  component: NotificationBadgeComponent,
  decorators: [moduleMetadata({ imports: [NotificationBadgeComponent, IconComponent] })],
};
export default meta;

type Story = StoryObj<NotificationBadgeComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; padding:24px; background:#0D1655;">
        <button style="position:relative; width:40px; height:40px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.06); display:inline-flex; align-items:center; justify-content:center; color:#fff;">
          <app-icon name="notifications" />
          <app-notification-badge [text]="3" />
        </button>
        <button style="position:relative; width:40px; height:40px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.06); display:inline-flex; align-items:center; justify-content:center; color:#fff;">
          <app-icon name="notifications" />
          <app-notification-badge text="9+" [pulse]="true" />
        </button>
        <button style="position:relative; width:40px; height:40px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.06); display:inline-flex; align-items:center; justify-content:center; color:#fff;">
          <app-icon name="notifications" />
          <app-notification-badge [text]="null" />
        </button>
      </div>
    `,
  }),
};
