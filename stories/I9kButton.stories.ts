import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kButton from '../src/components/I9kButton.vue';

const meta = {
  title: 'Components/I9kButton',
  component: I9kButton,
  args: { variant: 'default' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'link', 'filter', 'pagination', 'page'],
    },
  },
} satisfies Meta<typeof I9kButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kButton },
    setup: () => ({ args }),
    template: '<I9kButton v-bind="args">Default button</I9kButton>',
  }),
};
export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) => ({
    components: { I9kButton },
    setup: () => ({ args }),
    template: '<I9kButton v-bind="args">Primary action</I9kButton>',
  }),
};
export const States: Story = {
  render: () => ({
    components: { I9kButton },
    template:
      '<div class="cluster"><I9kButton>Default</I9kButton><I9kButton variant="primary">Primary</I9kButton><I9kButton variant="link">Link</I9kButton><I9kButton variant="filter" active>Selected</I9kButton><I9kButton disabled>Disabled</I9kButton></div>',
  }),
};
