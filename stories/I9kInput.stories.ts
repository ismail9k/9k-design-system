import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kInput from '../src/components/I9kInput.vue';

const meta = {
  title: 'Components/I9kInput',
  component: I9kInput,
  args: { modelValue: '', label: 'البريد الإلكتروني', type: 'email' },
  argTypes: {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
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

export const Sizes: Story = {
  render: () => ({
    components: { I9kInput },
    template:
      '<div><I9kInput model-value="" label="Small" ui-size="sm" /><I9kInput model-value="" label="Medium" ui-size="md" /><I9kInput model-value="" label="Large" ui-size="lg" /></div>',
  }),
};
