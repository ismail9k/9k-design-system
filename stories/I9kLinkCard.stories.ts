import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kLinkCard from '../src/components/I9kLinkCard.vue';

const meta = {
  title: 'Components/I9kLinkCard',
  component: I9kLinkCard,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    name: 'vue3-carousel',
    url: 'https://github.com/ismail9k/vue3-carousel',
    description: 'A flexible, responsive carousel component for Vue 3.',
  },
} satisfies Meta<typeof I9kLinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBadgeAndArrow: Story = { args: { badge: 'Open source', arrow: true } };
export const WithImage: Story = {
  args: { image: 'https://avatars.githubusercontent.com/u/20756985?s=120&v=4', badge: 'Library' },
};
export const Sizes: Story = {
  render: () => ({
    components: { I9kLinkCard },
    template:
      '<div style="display: grid; gap: var(--component-gap-md)"><I9kLinkCard size="sm" name="Small card" url="https://example.com/small" description="Compact link card" /><I9kLinkCard size="md" name="Medium card" url="https://example.com/medium" description="Default link card" /><I9kLinkCard size="lg" name="Large card" url="https://example.com/large" description="Prominent link card" /></div>',
  }),
};
export const RightToLeft: Story = {
  decorators: [(story) => ({ components: { story }, template: '<div dir="rtl"><story /></div>' })],
};
