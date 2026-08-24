import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kField from '../src/components/I9kField.vue';

const meta = {
  title: 'Components/I9kField',
  component: I9kField,
  args: { label: 'البريد الإلكتروني', hint: 'استخدم بريد العمل الإلكتروني' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kField>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderWithNativeInput = (args: Story['args']) => ({
  components: { I9kField },
  setup: () => ({ args }),
  template: `
    <I9kField v-bind="args">
      <template #default="{ controlId, describedBy, invalid, required }">
        <input
          :id="controlId"
          type="email"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
          :required="required"
        />
      </template>
    </I9kField>
  `,
});

export const Default: Story = {
  render: renderWithNativeInput,
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kField },
    template: `
      <div>
        <I9kField label="Small" size="sm"><template #default="{ controlId }"><input :id="controlId" /></template></I9kField>
        <I9kField label="Medium" size="md"><template #default="{ controlId }"><input :id="controlId" /></template></I9kField>
        <I9kField label="Large" size="lg"><template #default="{ controlId }"><input :id="controlId" /></template></I9kField>
      </div>
    `,
  }),
};

export const Required: Story = {
  args: { required: true },
  render: renderWithNativeInput,
};

export const WithError: Story = {
  args: { error: 'هذا الحقل مطلوب' },
  render: renderWithNativeInput,
};

export const LongLabel: Story = {
  args: { label: 'عنوان طويل يوضح كيف يتعامل الحقل مع تسميات النماذج المطوّلة' },
  render: renderWithNativeInput,
};

export const RightToLeft: Story = {
  render: (args) => ({
    components: { I9kField },
    setup: () => ({ args }),
    template: `
      <div lang="ar" dir="rtl">
        <I9kField v-bind="args">
          <template #default="{ controlId, describedBy, invalid, required }">
            <input
              :id="controlId"
              type="email"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
              :required="required"
            />
          </template>
        </I9kField>
      </div>
    `,
  }),
};
