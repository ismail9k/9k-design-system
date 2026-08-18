import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kSectionHeading from '../src/components/I9kSectionHeading.vue';

const meta = {
  title: 'Components/I9kSectionHeading',
  component: I9kSectionHeading,
  args: {
    number: '03',
    title: 'Speaking',
    description: 'Practical sessions grounded in building, shipping, and leading with AI.',
  },
} satisfies Meta<typeof I9kSectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutNumber: Story = { args: { number: null } };
