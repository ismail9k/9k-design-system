import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kGithubEmbed from '../src/components/I9kGithubEmbed.vue';

const meta = {
  title: 'Components/I9kGithubEmbed',
  component: I9kGithubEmbed,
  args: { repo: 'ismail9k/vue3-carousel' },
} satisfies Meta<typeof I9kGithubEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const RightToLeft: Story = {
  decorators: [(story) => ({ components: { story }, template: '<div dir="rtl"><story /></div>' })],
};
