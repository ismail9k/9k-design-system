import type { Meta, StoryObj } from '@storybook/vue3-vite';

import I9kButton from '../src/components/I9kButton.vue';
import I9kButtonGroup from '../src/components/I9kButtonGroup.vue';
import I9kIconButton from '../src/components/I9kIconButton.vue';

const meta = {
  title: 'Components/I9kButtonGroup',
  component: I9kButtonGroup,
  args: { label: 'Article actions', orientation: 'horizontal', size: 'md' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof I9kButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    setup: () => ({ args }),
    template:
      '<I9kButtonGroup v-bind="args"><I9kButton>Save</I9kButton><I9kIconButton icon="mail" label="Email article" /></I9kButtonGroup>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    template:
      '<div class="stack"><I9kButtonGroup label="Small actions" size="sm"><I9kButton size="sm">Save</I9kButton><I9kIconButton icon="mail" label="Email" size="sm" /></I9kButtonGroup><I9kButtonGroup label="Medium actions" size="md"><I9kButton size="md">Save</I9kButton><I9kIconButton icon="mail" label="Email" size="md" /></I9kButtonGroup><I9kButtonGroup label="Large actions" size="lg"><I9kButton size="lg">Save</I9kButton><I9kIconButton icon="mail" label="Email" size="lg" /></I9kButtonGroup></div>',
  }),
};

export const Vertical: Story = {
  render: () => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    template:
      '<I9kButtonGroup label="Article actions" orientation="vertical"><I9kButton>Save</I9kButton><I9kButton variant="default">Preview</I9kButton><I9kIconButton icon="mail" label="Email article" /></I9kButtonGroup>',
  }),
};

export const Wrapping: Story = {
  render: () => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    template:
      '<div style="max-width: 14rem"><I9kButtonGroup label="Article actions"><I9kButton>Save draft</I9kButton><I9kButton>Preview</I9kButton><I9kButton>Publish</I9kButton><I9kIconButton icon="mail" label="Email article" /></I9kButtonGroup></div>',
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    template:
      '<div lang="ar" dir="rtl"><I9kButtonGroup label="إجراءات المقال"><I9kButton>حفظ</I9kButton><I9kButton>معاينة</I9kButton><I9kIconButton icon="mail" label="مراسلة حول المقال" /></I9kButtonGroup></div>',
  }),
};
