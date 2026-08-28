import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kCheckboxGroup from '../src/components/I9kCheckboxGroup.vue';

const options = [
  { label: 'Engineering', value: 'engineering', description: 'Technical product work' },
  { label: 'Design', value: 'design', description: 'Product and interface design' },
  { label: 'Advisory', value: 'advisory', description: 'Strategy and review' },
] as const;

const meta = {
  title: 'Components/I9kCheckboxGroup',
  component: I9kCheckboxGroup,
  args: { modelValue: ['engineering'], options, legend: 'Choose your interests' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof I9kCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { I9kCheckboxGroup },
    setup: () => ({ options }),
    template: `
      <div style="display: grid; gap: var(--spacing-13)">
        <I9kCheckboxGroup :model-value="['engineering']" :options="options" legend="Small interests" size="sm" />
        <I9kCheckboxGroup :model-value="['engineering']" :options="options" legend="Medium interests" size="md" />
        <I9kCheckboxGroup :model-value="['engineering']" :options="options" legend="Large interests" size="lg" />
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const DisabledOption: Story = {
  args: {
    options: [...options.slice(0, 2), { ...options[2], disabled: true }],
  },
};

export const DisabledGroup: Story = {
  args: { disabled: true },
};

export const WithError: Story = {
  args: { modelValue: [], required: true, error: 'Choose at least one interest.' },
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kCheckboxGroup },
    setup: () => ({
      selected: ref(['software-engineering-ai', 'vibe-coder']),
      options: [
        { label: 'هندسة البرمجيات في عصر الذكاء الاصطناعي', value: 'software-engineering-ai' },
        { label: 'ما لا يسع الـ Vibe Coder جهله', value: 'vibe-coder' },
        { label: 'ابني مساعد شخصي ذكي باستخدام Hermes', value: 'hermes' },
      ],
    }),
    template: `
      <div lang="ar" dir="rtl" style="max-width: 44rem">
        <I9kCheckboxGroup
          v-model="selected"
          :options="options"
          legend="ما الدورات التي تهمّك؟"
          hint="اختر واحدة أو أكثر"
        />
      </div>
    `,
  }),
};
