import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kInput from '../src/components/I9kInput.vue';

const meta = {
  title: 'Components/I9kInput',
  component: I9kInput,
  args: { modelValue: '', label: 'البريد الإلكتروني', type: 'email' },
} satisfies Meta<typeof I9kInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kInput },
    setup: () => ({ args }),
    template: '<I9kInput v-bind="args" @update:modelValue="() => {}" />',
  }),
};

export const WithError: Story = {
  args: { error: 'هذا الحقل مطلوب' },
  render: (args) => ({
    components: { I9kInput },
    setup: () => ({ args }),
    template: '<I9kInput v-bind="args" @update:modelValue="() => {}" />',
  }),
};

export const Rtl: Story = {
  render: (args) => ({
    components: { I9kInput },
    setup: () => ({ args }),
    template:
      '<div lang="ar" dir="rtl"><I9kInput v-bind="args" @update:modelValue="() => {}" /></div>',
  }),
};
