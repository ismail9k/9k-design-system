import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kTimelineCard from '../src/components/I9kTimelineCard.vue';

const meta = {
  title: 'Components/I9kTimelineCard',
  component: I9kTimelineCard,
  args: { date: '2026-01-25', linked: true },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kTimelineCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linked: Story = {
  render: (args) => ({
    components: { I9kTimelineCard },
    setup: () => ({ args }),
    template:
      '<I9kTimelineCard v-bind="args"><template #title><a href="#">Are AI coding tools ready to replace programmers?</a></template><p>A practical discussion of what today’s tools can do and what still needs engineering judgement.</p><template #thumbnail><img src="https://i.ytimg.com/vi/NfRC9Lj4-rU/hqdefault.jpg" alt="" width="160" height="100"></template></I9kTimelineCard>',
  }),
};
export const Arabic: Story = {
  ...Linked,
  args: { date: '2026-01-25', locale: 'ar' },
  decorators: [(story) => ({ components: { story }, template: '<div dir="rtl"><story /></div>' })],
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kTimelineCard },
    template:
      '<div><I9kTimelineCard date="2026-01-25" size="sm"><template #title>Small timeline card</template>Compact summary.</I9kTimelineCard><I9kTimelineCard date="2026-01-25" size="md"><template #title>Medium timeline card</template>Default summary.</I9kTimelineCard><I9kTimelineCard date="2026-01-25" size="lg"><template #title>Large timeline card</template>Prominent summary.</I9kTimelineCard></div>',
  }),
};
