import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = { title: 'Foundations/Tokens and primitives' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => ({
    template: `
      <div class="grid grid--3">
        <article class="surface" style="padding: var(--spacing-11)">.surface</article>
        <article class="surface surface--interactive" style="padding: var(--spacing-11)">.surface--interactive</article>
        <article class="surface surface--feature" style="padding: var(--spacing-11)">.surface--feature</article>
      </div>
      <div class="cluster" style="margin-top: var(--spacing-13)">
        <span class="badge badge--solid">Featured</span>
        <span class="badge badge--outline">Open source</span>
        <span class="badge badge--tag">AI</span>
      </div>
      <div class="grid grid--3" style="margin-top: var(--spacing-13)">
        <div class="stat"><span class="stat__value">10+</span><span class="stat__label">years building products</span></div>
        <div class="stat"><span class="stat__value">480k+</span><span class="stat__label">monthly downloads</span></div>
      </div>
    `,
  }),
};
