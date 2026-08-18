import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kLinkCard from '../src/components/I9kLinkCard.vue';

const meta = {
  title: 'Components/I9kLinkCard',
  component: I9kLinkCard,
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
export const RightToLeft: Story = {
  decorators: [(story) => ({ components: { story }, template: '<div dir="rtl"><story /></div>' })],
};
