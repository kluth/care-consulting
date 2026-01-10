import { Preview } from '@storybook/angular';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  loaders: [mswLoader],
};

export default preview;
