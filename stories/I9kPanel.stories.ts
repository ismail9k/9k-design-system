import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kPanel from '../src/components/I9kPanel.vue';

const meta = {
  title: 'Components/I9kPanel',
  component: I9kPanel,
  args: { size: 'md', variant: 'default' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'feature', 'flat'] },
  },
} satisfies Meta<typeof I9kPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kPanel },
    setup: () => ({ args }),
    template: '<I9kPanel v-bind="args">A scoped panel for deliberate content.</I9kPanel>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { I9kPanel },
    template: `
      <div style="display: grid; gap: var(--spacing-8); grid-template-columns: repeat(3, minmax(0, 1fr))">
        <I9kPanel variant="default">Default panel</I9kPanel>
        <I9kPanel variant="feature">Feature panel</I9kPanel>
        <I9kPanel variant="flat">Flat panel</I9kPanel>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kPanel },
    template: `
      <div style="display: grid; gap: var(--spacing-8)">
        <I9kPanel size="sm">Small panel</I9kPanel>
        <I9kPanel size="md">Medium panel</I9kPanel>
        <I9kPanel size="lg">Large panel</I9kPanel>
      </div>
    `,
  }),
};
