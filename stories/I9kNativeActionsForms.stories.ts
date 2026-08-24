import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import {
  I9kButton,
  I9kButtonGroup,
  I9kField,
  I9kIconButton,
  I9kInput,
  I9kRadioGroup,
  I9kSelect,
  I9kTextarea,
} from '../src';

const radioOptions = [
  { label: 'تدقيق منتج', value: 'audit', description: 'مراجعة منتج قائم' },
  { label: 'بناء منتج', value: 'build', description: 'إنشاء تجربة جديدة' },
] as const;

const meta = { title: 'Examples/NativeActionsForms' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActionsAndSizes: Story = {
  render: () => ({
    components: { I9kButton, I9kButtonGroup, I9kIconButton },
    template: `
      <div style="display: grid; gap: var(--component-gap-lg); max-width: 52rem">
        <I9kButtonGroup label="Small actions" size="sm">
          <I9kButton size="sm">Save draft</I9kButton>
          <I9kIconButton icon="mail" label="Email draft" size="sm" />
        </I9kButtonGroup>
        <I9kButtonGroup label="Medium actions" size="md">
          <I9kButton size="md">Save draft</I9kButton>
          <I9kIconButton icon="mail" label="Email draft" size="md" />
        </I9kButtonGroup>
        <I9kButtonGroup label="Large actions" size="lg">
          <I9kButton size="lg">Save draft</I9kButton>
          <I9kIconButton icon="mail" label="Email draft" size="lg" />
        </I9kButtonGroup>
      </div>
    `,
  }),
};

export const FieldStates: Story = {
  render: () => ({
    components: { I9kField, I9kInput },
    setup: () => ({
      hintValue: ref('studio@ismail9k.com'),
      requiredValue: ref(''),
      invalidValue: ref('draft'),
    }),
    template: `
      <div style="display: grid; gap: var(--component-gap-lg); grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); max-width: 64rem">
        <I9kField label="Contact email" hint="Use the address checked by your team.">
          <I9kInput v-model="hintValue" name="email" type="email" autocomplete="email" />
        </I9kField>
        <I9kField label="Project name" hint="Required before the brief can be saved." required>
          <I9kInput v-model="requiredValue" name="project-name" required />
        </I9kField>
        <I9kField label="Workspace slug" error="Use at least six characters.">
          <I9kInput v-model="invalidValue" name="workspace-slug" aria-invalid="true" />
        </I9kField>
      </div>
    `,
  }),
};

export const NativeControlsRtl: Story = {
  render: () => ({
    components: { I9kField, I9kSelect, I9kTextarea },
    setup: () => ({
      detailsSm: ref('مراجعة تجربة المنتج الحالية'),
      detailsMd: ref('بناء أساس واضح لواجهة المنتج'),
      detailsLg: ref('تطوير تجربة عربية متكاملة'),
      serviceSm: ref('audit'),
      serviceMd: ref('build'),
      serviceLg: ref('develop'),
    }),
    template: `
      <div lang="ar" dir="rtl" style="display: grid; gap: var(--component-gap-lg); max-width: 64rem">
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--component-gap-md)">
          <I9kField label="تفاصيل مختصرة" size="sm">
            <I9kTextarea v-model="detailsSm" name="details-sm" rows="2" resize="none" />
          </I9kField>
          <I9kField label="الخدمة الصغيرة" size="sm">
            <I9kSelect v-model="serviceSm" name="service-sm">
              <option value="audit">تدقيق منتج</option>
              <option value="build">بناء منتج</option>
            </I9kSelect>
          </I9kField>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--component-gap-md)">
          <I9kField label="تفاصيل المشروع" size="md">
            <I9kTextarea v-model="detailsMd" name="details-md" rows="2" resize="none" />
          </I9kField>
          <I9kField label="الخدمة المتوسطة" size="md">
            <I9kSelect v-model="serviceMd" name="service-md">
              <option value="audit">تدقيق منتج</option>
              <option value="build">بناء منتج</option>
            </I9kSelect>
          </I9kField>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--component-gap-md)">
          <I9kField label="تفاصيل موسعة" size="lg">
            <I9kTextarea v-model="detailsLg" name="details-lg" rows="2" resize="none" />
          </I9kField>
          <I9kField label="الخدمة الكبيرة" size="lg">
            <I9kSelect v-model="serviceLg" name="service-lg">
              <option value="develop">تطوير منتج</option>
              <option value="build">بناء منتج</option>
            </I9kSelect>
          </I9kField>
        </div>
      </div>
    `,
  }),
};

export const RadioCards: Story = {
  render: () => ({
    components: { I9kRadioGroup },
    setup: () => ({
      radioOptions,
      serviceSm: ref('audit'),
      serviceMd: ref('build'),
      serviceLg: ref('audit'),
    }),
    template: `
      <div lang="ar" dir="rtl" style="display: grid; gap: var(--component-gap-lg); max-width: 64rem">
        <I9kRadioGroup v-model="serviceSm" :options="radioOptions" legend="خيار صغير" variant="card" size="sm" />
        <I9kRadioGroup v-model="serviceMd" :options="radioOptions" legend="خيار متوسط" variant="card" size="md" />
        <I9kRadioGroup v-model="serviceLg" :options="radioOptions" legend="خيار كبير" variant="card" size="lg" />
      </div>
    `,
  }),
};
