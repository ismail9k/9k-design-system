import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kTimelineCard from '../src/components/I9kTimelineCard.vue';

const meta = {
  title: 'Components/I9kTimelineCard',
  component: I9kTimelineCard,
  args: { date: '2026-01-25', linked: true },
} satisfies Meta<typeof I9kTimelineCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linked: Story = {
  render: (args) => ({
    components: { I9kTimelineCard },
    setup: () => ({ args }),
    template:
      '<I9kTimelineCard v-bind="args"><h3 class="timeline__title"><a class="timeline__link" href="#">Are AI coding tools ready to replace programmers?</a></h3><p>A practical discussion of what today’s tools can do and what still needs engineering judgement.</p><template #thumbnail><img class="timeline__thumb" src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" alt="" width="160" height="100"></template></I9kTimelineCard>',
  }),
};
export const Arabic: Story = {
  ...Linked,
  args: { date: '2026-01-25', locale: 'ar' },
  decorators: [(story) => ({ components: { story }, template: '<div dir="rtl"><story /></div>' })],
};
