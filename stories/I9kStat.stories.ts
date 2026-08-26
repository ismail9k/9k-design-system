import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kStat from '../src/components/I9kStat.vue';

const meta = {
  title: 'Components/I9kStat',
  component: I9kStat,
  args: { label: 'monthly npm downloads', size: 'md', source: 'npm snapshot', value: '480k+' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof I9kStat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { I9kStat },
    template: `
      <div style="display: grid; gap: var(--spacing-13); grid-template-columns: repeat(3, minmax(0, 1fr))">
        <I9kStat label="small stat" size="sm" value="12" />
        <I9kStat label="monthly downloads" size="md" value="480k+" />
        <I9kStat label="years building products" size="lg" value="10+" />
      </div>
    `,
  }),
};

export const RichSlots: Story = {
  render: () => ({
    components: { I9kStat },
    template: `
      <I9kStat>
        <template #value><strong>99.9%</strong></template>
        <template #label>availability target</template>
        <template #source><a href="#" @click.prevent>service report</a></template>
      </I9kStat>
    `,
  }),
};
