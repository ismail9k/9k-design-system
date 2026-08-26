import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kText from '../src/components/I9kText.vue';

const meta = {
  title: 'Components/I9kText',
  component: I9kText,
  args: { size: 'md', variant: 'body' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['body', 'lede'] },
  },
} satisfies Meta<typeof I9kText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kText },
    setup: () => ({ args }),
    template: '<I9kText v-bind="args">A practical text primitive for branded content.</I9kText>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { I9kText },
    template: `
      <div>
        <I9kText variant="body">Body text keeps normal content flow.</I9kText>
        <I9kText variant="lede">Lede text introduces a page with a deliberate measure and quieter color.</I9kText>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kText },
    template: `
      <div>
        <I9kText size="sm">Small body text</I9kText>
        <I9kText size="md">Medium body text</I9kText>
        <I9kText size="lg">Large body text</I9kText>
      </div>
    `,
  }),
};

export const ArabicLede: Story = {
  render: () => ({
    components: { I9kText },
    template:
      '<div lang="ar" dir="rtl"><I9kText variant="lede">مقدمة واضحة تحافظ على إيقاع القراءة العربية.</I9kText></div>',
  }),
};
