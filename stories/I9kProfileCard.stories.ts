import type { Meta, StoryObj } from '@storybook/vue3-vite';
import I9kProfileCard from '../src/components/I9kProfileCard.vue';

const meta = {
  title: 'Components/I9kProfileCard',
  component: I9kProfileCard,
  args: {
    name: 'Abdelrahman Ismail',
    alias: 'Ismail9k',
    namePrefix: 'Written by',
  },
} satisfies Meta<typeof I9kProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { I9kProfileCard },
    setup: () => ({ args }),
    template:
      '<I9kProfileCard v-bind="args" avatar-src="https://avatars.githubusercontent.com/u/20756985?s=120&v=4">Software engineer sharing how AI is changing the way software gets built.</I9kProfileCard>',
  }),
};
export const WithActions: Story = {
  render: (args) => ({
    components: { I9kProfileCard },
    setup: () => ({ args }),
    template:
      '<I9kProfileCard v-bind="args" avatar-src="https://avatars.githubusercontent.com/u/20756985?s=120&v=4">Software engineer sharing how AI is changing the way software gets built.<template #actions><div class="cluster cluster--tight"><a class="btn" href="#">Instagram</a><a class="btn" href="#">GitHub</a></div></template></I9kProfileCard>',
  }),
};
