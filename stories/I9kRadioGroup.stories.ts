import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kRadioGroup from '../src/components/I9kRadioGroup.vue';

const options = [
  { label: 'Technical audit', value: 'audit', description: 'Review an existing product' },
  { label: 'Design system', value: 'design', description: 'Create shared interface foundations' },
  {
    label: 'Product development',
    value: 'development',
    description: 'Build a new digital product',
  },
] as const;

const meta = {
  title: 'Components/I9kRadioGroup',
  component: I9kRadioGroup,
  args: { modelValue: 'audit', options, legend: 'Choose a service' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'card'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof I9kRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { I9kRadioGroup },
    setup: () => ({ options }),
    template: `
      <div>
        <I9kRadioGroup model-value="audit" :options="options" legend="Small service" size="sm" />
        <I9kRadioGroup model-value="audit" :options="options" legend="Medium service" size="md" />
        <I9kRadioGroup model-value="audit" :options="options" legend="Large service" size="lg" />
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Cards: Story = {
  args: { variant: 'card' },
};

export const DisabledOption: Story = {
  args: {
    options: [...options, { label: 'Advisory', value: 'advisory', disabled: true }],
  },
};

export const DisabledGroup: Story = {
  args: { disabled: true },
};

export const WithError: Story = {
  args: { modelValue: '', required: true, error: 'Choose the service you need.' },
};

export const LongDescriptions: Story = {
  args: {
    variant: 'card',
    options: [
      {
        label: 'Technical audit',
        value: 'audit',
        description:
          'An independent, detailed assessment of your current product, team workflow, and technical foundations, with an actionable path forward.',
      },
      {
        label: 'Design system',
        value: 'design',
        description:
          'A scalable collection of visual language, reusable components, and documentation that helps teams deliver consistent experiences over time.',
      },
    ],
  },
};

export const ArabicCards: Story = {
  render: () => ({
    components: { I9kRadioGroup },
    setup: () => ({
      options: [
        { label: 'تدقيق تقني', value: 'audit', description: 'مراجعة المنتج الحالي' },
        { label: 'نظام تصميم', value: 'design', description: 'بناء أساس واجهات متسق' },
      ],
    }),
    template:
      '<I9kRadioGroup model-value="audit" :options="options" legend="اختر الخدمة" variant="card" />',
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kRadioGroup },
    setup: () => ({
      options: [
        { label: 'تدقيق تقني', value: 'audit', description: 'مراجعة المنتج الحالي' },
        { label: 'نظام تصميم', value: 'design', description: 'بناء أساس واجهات متسق' },
      ],
    }),
    template: `
      <div lang="ar" dir="rtl">
        <I9kRadioGroup model-value="audit" :options="options" legend="اختر الخدمة" variant="card" />
      </div>
    `,
  }),
};
