import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kAsciiEmoji from '../src/components/I9kAsciiEmoji.vue';

const meta = {
  title: 'Components/I9kAsciiEmoji',
  component: I9kAsciiEmoji,
  args: { name: '^_^', size: 'lg', color: 'primary' },
  argTypes: {
    name: { control: 'select', options: ['^_^', '·ᴗ·', '◡̈', '>‿<', 'x_x', 'o_o', '-_-'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'accent', 'muted', 'current'] },
  },
} satisfies Meta<typeof I9kAsciiEmoji>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => ({
    components: { I9kAsciiEmoji },
    template:
      '<div style="display: inline-flex; align-items: center; gap: var(--component-gap-md)"><I9kAsciiEmoji name="^_^" size="sm" /><I9kAsciiEmoji name="^_^" size="md" /><I9kAsciiEmoji name="^_^" size="lg" /></div>',
  }),
};
export const ExpressionSet: Story = {
  render: () => ({
    components: { I9kAsciiEmoji },
    template:
      '<div class="cluster"><I9kAsciiEmoji name="^_^" size="lg"/><I9kAsciiEmoji name="·ᴗ·" size="lg" color="accent"/><I9kAsciiEmoji name="◡̈" size="lg"/><I9kAsciiEmoji name=">‿<" size="lg" color="muted"/><I9kAsciiEmoji name="x_x" size="lg"/></div>',
  }),
};
