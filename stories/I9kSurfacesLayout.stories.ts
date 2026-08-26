import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  I9kBadge,
  I9kCluster,
  I9kGrid,
  I9kPageContainer,
  I9kPanel,
  I9kStat,
  I9kText,
} from '../src';

const content = {
  ltr: {
    lede: 'A clear view of product reach across channels.',
    items: [
      { tag: 'npm', value: '480k+', label: 'monthly downloads' },
      { tag: 'career', value: '10+', label: 'years building products' },
      { tag: 'community', value: '30+', label: 'talks and appearances' },
    ],
  },
  rtl: {
    lede: 'نظرة واضحة على أثر المنتج عبر القنوات.',
    items: [
      { tag: 'npm', value: '٤٨٠ ألف+', label: 'تنزيل شهري' },
      { tag: 'خبرة', value: '١٠+', label: 'سنوات في بناء المنتجات' },
      { tag: 'مجتمع', value: '٣٠+', label: 'محاضرة ومشاركة' },
    ],
  },
};

const meta = { title: 'Examples/SurfacesLayout' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const renderComposition = (direction: 'ltr' | 'rtl') => ({
  components: { I9kBadge, I9kCluster, I9kGrid, I9kPageContainer, I9kPanel, I9kStat, I9kText },
  setup: () => ({ content: content[direction], direction }),
  template: `
    <I9kPageContainer :dir="direction" :lang="direction === 'rtl' ? 'ar' : 'en'">
      <I9kText variant="lede">{{ content.lede }}</I9kText>
      <I9kGrid :columns="3">
        <I9kPanel v-for="item in content.items" :key="item.label">
          <I9kCluster size="sm" style="margin-bottom: var(--spacing-6)">
            <I9kBadge variant="tag">{{ item.tag }}</I9kBadge>
          </I9kCluster>
          <I9kStat :value="item.value" :label="item.label" />
        </I9kPanel>
      </I9kGrid>
    </I9kPageContainer>
  `,
});

export const LeftToRight: Story = { render: () => renderComposition('ltr') };
export const RightToLeft: Story = { render: () => renderComposition('rtl') };
