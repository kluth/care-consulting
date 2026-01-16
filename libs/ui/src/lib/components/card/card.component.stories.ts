import { Meta, StoryObj } from '@storybook/angular';
import { UiCardComponent } from './card.component';

const meta: Meta<UiCardComponent> = {
  component: UiCardComponent,
  title: 'UiCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<UiCardComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-card>
        <h3 header>Card Header</h3>
        <p>This is the body content of the card.</p>
        <button footer>Action</button>
      </ui-card>
    `,
  }),
};
