import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kBadge from '../src/components/I9kBadge.vue';
import I9kButton from '../src/components/I9kButton.vue';
import I9kCluster from '../src/components/I9kCluster.vue';

const meta = {
  title: 'Components/I9kCluster',
  component: I9kCluster,
  args: { size: 'md' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof I9kCluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kBadge, I9kButton, I9kCluster },
    setup: () => ({ args }),
    template: `
      <I9kCluster v-bind="args">
        <I9kButton>Primary action</I9kButton>
        <I9kButton variant="secondary">Secondary action</I9kButton>
        <I9kBadge variant="outline">Status</I9kBadge>
      </I9kCluster>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kBadge, I9kCluster },
    template: `
      <div style="display: grid; gap: var(--spacing-13)">
        <I9kCluster size="sm"><I9kBadge>Small</I9kBadge><I9kBadge>Cluster</I9kBadge></I9kCluster>
        <I9kCluster size="md"><I9kBadge>Medium</I9kBadge><I9kBadge>Cluster</I9kBadge></I9kCluster>
        <I9kCluster size="lg"><I9kBadge>Large</I9kBadge><I9kBadge>Cluster</I9kBadge></I9kCluster>
      </div>
    `,
  }),
};

export const Wrapping: Story = {
  render: () => ({
    components: { I9kBadge, I9kCluster },
    template: `
      <I9kCluster style="max-width: 16rem">
        <I9kBadge v-for="label in ['Design systems', 'Vue', 'Accessibility', 'RTL']" :key="label" variant="tag">{{ label }}</I9kBadge>
      </I9kCluster>
    `,
  }),
};
