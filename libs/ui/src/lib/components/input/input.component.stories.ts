import { Meta, StoryObj } from '@storybook/angular';
import { UiInputComponent } from './input.component';

const meta: Meta<UiInputComponent> = {
  component: UiInputComponent,
  title: 'UiInput',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<UiInputComponent>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Invalid email address',
  },
};
