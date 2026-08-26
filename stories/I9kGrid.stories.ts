import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kGrid from '../src/components/I9kGrid.vue';
import I9kPanel from '../src/components/I9kPanel.vue';

const meta = {
  title: 'Components/I9kGrid',
  component: I9kGrid,
  args: { columns: 3, size: 'md' },
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 'auto'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kGrid, I9kPanel },
    setup: () => ({ args }),
    template: `
      <I9kGrid v-bind="args">
        <I9kPanel size="sm">One</I9kPanel>
        <I9kPanel size="sm">Two</I9kPanel>
        <I9kPanel size="sm">Three</I9kPanel>
      </I9kGrid>
    `,
  }),
};

export const Columns: Story = {
  render: () => ({
    components: { I9kGrid, I9kPanel },
    template: `
      <div style="display: grid; gap: var(--spacing-13)">
        <I9kGrid :columns="2"><I9kPanel size="sm">Two</I9kPanel><I9kPanel size="sm">columns</I9kPanel></I9kGrid>
        <I9kGrid :columns="3"><I9kPanel size="sm">Three</I9kPanel><I9kPanel size="sm">equal</I9kPanel><I9kPanel size="sm">columns</I9kPanel></I9kGrid>
        <I9kGrid columns="auto"><I9kPanel size="sm">Auto</I9kPanel><I9kPanel size="sm">fill</I9kPanel></I9kGrid>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kGrid, I9kPanel },
    template: `
      <div style="display: grid; gap: var(--spacing-13)">
        <I9kGrid :columns="2" size="sm"><I9kPanel size="sm">Small</I9kPanel><I9kPanel size="sm">gap</I9kPanel></I9kGrid>
        <I9kGrid :columns="2" size="md"><I9kPanel size="sm">Medium</I9kPanel><I9kPanel size="sm">gap</I9kPanel></I9kGrid>
        <I9kGrid :columns="2" size="lg"><I9kPanel size="sm">Large</I9kPanel><I9kPanel size="sm">gap</I9kPanel></I9kGrid>
      </div>
    `,
  }),
};
