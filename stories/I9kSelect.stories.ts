import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kField from '../src/components/I9kField.vue';
import I9kSelect from '../src/components/I9kSelect.vue';

const options = `
  <option value="">Choose a service</option>
  <option value="audit">Technical audit</option>
  <option value="design">Design system</option>
  <option value="development">Development</option>
`;

const meta = {
  title: 'Components/I9kSelect',
  component: I9kSelect,
  args: { modelValue: '' },
  argTypes: {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kField, I9kSelect },
    setup: () => ({ args }),
    template: `<I9kField label="Service"><I9kSelect v-bind="args">${options}</I9kSelect></I9kField>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kField, I9kSelect },
    template: `
      <div>
        <I9kField label="Small" size="sm"><I9kSelect model-value="">${options}</I9kSelect></I9kField>
        <I9kField label="Medium" size="md"><I9kSelect model-value="">${options}</I9kSelect></I9kField>
        <I9kField label="Large" size="lg"><I9kSelect model-value="">${options}</I9kSelect></I9kField>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { I9kField, I9kSelect },
    template: `<I9kField label="Service"><I9kSelect model-value="audit" disabled>${options}</I9kSelect></I9kField>`,
  }),
};

export const WithError: Story = {
  render: () => ({
    components: { I9kField, I9kSelect },
    template: `<I9kField label="Service" error="Select the service you need."><I9kSelect model-value="">${options}</I9kSelect></I9kField>`,
  }),
};

export const ArabicOptions: Story = {
  render: () => ({
    components: { I9kField, I9kSelect },
    template: `
      <I9kField label="الخدمة">
        <I9kSelect model-value="">
          <option value="">اختر الخدمة</option>
          <option value="audit">تدقيق تقني</option>
          <option value="design">نظام التصميم</option>
        </I9kSelect>
      </I9kField>
    `,
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kField, I9kSelect },
    template: `
      <div lang="ar" dir="rtl">
        <I9kField label="الخدمة" hint="اختر الخدمة المناسبة">
          <I9kSelect model-value="">
            <optgroup label="الخدمات الاستشارية">
              <option value="audit">تدقيق تقني</option>
              <option value="design">نظام التصميم</option>
            </optgroup>
          </I9kSelect>
        </I9kField>
      </div>
    `,
  }),
};
