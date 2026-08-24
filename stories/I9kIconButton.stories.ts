import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kIconButton from '../src/components/I9kIconButton.vue';

const meta = {
  title: 'Components/I9kIconButton',
  component: I9kIconButton,
  args: { icon: 'home', label: 'Go home', variant: 'secondary', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['secondary', 'primary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    components: { I9kIconButton },
    template:
      '<div class="cluster"><I9kIconButton icon="home" label="Home" /><I9kIconButton icon="mail" label="Mail" variant="primary" /><I9kIconButton icon="menu" label="Menu" variant="ghost" /></div>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kIconButton },
    template:
      '<div class="cluster"><I9kIconButton icon="home" label="Small home" size="sm" /><I9kIconButton icon="home" label="Medium home" size="md" /><I9kIconButton icon="home" label="Large home" size="lg" /></div>',
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { I9kIconButton },
    template: '<I9kIconButton icon="mail" label="Send mail" disabled />',
  }),
};

export const AsLink: Story = {
  args: { icon: 'github', label: 'GitHub', href: 'https://github.com/ismail9k' },
};

export const RightToLeft: Story = {
  args: { icon: 'menu', label: 'القائمة' },
  decorators: [
    (story) => ({ components: { story }, template: '<div lang="ar" dir="rtl"><story /></div>' }),
  ],
};
