import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kBadge from '../src/components/I9kBadge.vue';

const meta = {
  title: 'Components/I9kBadge',
  component: I9kBadge,
  args: { size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['solid', 'outline', 'tag'] },
  },
} satisfies Meta<typeof I9kBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kBadge },
    setup: () => ({ args }),
    template: '<I9kBadge v-bind="args">Open source</I9kBadge>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { I9kBadge },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-6)">
        <I9kBadge variant="solid">Featured</I9kBadge>
        <I9kBadge variant="outline">Open source</I9kBadge>
        <I9kBadge variant="tag">AI</I9kBadge>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kBadge },
    template: `
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-6)">
        <I9kBadge size="sm" variant="tag">Small</I9kBadge>
        <I9kBadge size="md" variant="tag">Medium</I9kBadge>
        <I9kBadge size="lg" variant="tag">Large</I9kBadge>
      </div>
    `,
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kBadge },
    template: '<div lang="ar" dir="rtl"><I9kBadge variant="tag">الذكاء الاصطناعي</I9kBadge></div>',
  }),
};
