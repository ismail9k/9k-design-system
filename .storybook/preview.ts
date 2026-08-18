import type { Preview } from '@storybook/vue3-vite';
import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
    colorMode: {
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.colorMode === 'dark');
      document.documentElement.classList.toggle('light', context.globals.colorMode !== 'dark');
      return {
        components: { story },
        template: '<main class="i9k-story i9k-root"><story /></main>',
      };
    },
  ],
  parameters: {
    a11y: { test: 'todo' },
    controls: { expanded: true },
    layout: 'padded',
  },
};

export default preview;
