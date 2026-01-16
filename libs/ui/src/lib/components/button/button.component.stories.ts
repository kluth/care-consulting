import { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';

const meta: Meta<UiButtonComponent> = {
  component: UiButtonComponent,
  title: 'UiButton',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'outline'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
};
export default meta;
type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [size]="size" [loading]="loading">Button</ui-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant">Button</ui-button>`,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [loading]="loading">Loading...</ui-button>`,
  }),
};
