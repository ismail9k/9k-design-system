import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kField from '../src/components/I9kField.vue';
import I9kTextarea from '../src/components/I9kTextarea.vue';

const meta = {
  title: 'Components/I9kTextarea',
  component: I9kTextarea,
  args: { modelValue: '', resize: 'vertical' },
  argTypes: {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    resize: { control: 'select', options: ['vertical', 'horizontal', 'both', 'none'] },
  },
} satisfies Meta<typeof I9kTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kField, I9kTextarea },
    setup: () => ({ args }),
    template: '<I9kField label="Project details"><I9kTextarea v-bind="args" /></I9kField>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template: `
      <div>
        <I9kField label="Small" size="sm"><I9kTextarea model-value="" /></I9kField>
        <I9kField label="Medium" size="md"><I9kTextarea model-value="" /></I9kField>
        <I9kField label="Large" size="lg"><I9kTextarea model-value="" /></I9kField>
      </div>
    `,
  }),
};

export const Readonly: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template:
      '<I9kField label="Project details"><I9kTextarea model-value="This content cannot be edited." readonly /></I9kField>',
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template:
      '<I9kField label="Project details"><I9kTextarea model-value="This content is unavailable." disabled /></I9kField>',
  }),
};

export const WithError: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template:
      '<I9kField label="Project details" error="Please provide project details."><I9kTextarea model-value="" /></I9kField>',
  }),
};

export const LongContent: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template:
      '<I9kField label="Project details"><I9kTextarea model-value="A detailed project description can span several paragraphs while the textarea remains usable and readable." /></I9kField>',
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kField, I9kTextarea },
    template:
      '<div lang="ar" dir="rtl"><I9kField label="تفاصيل المشروع" error="أدخل تفاصيل المشروع"><I9kTextarea model-value="" /></I9kField></div>',
  }),
};
