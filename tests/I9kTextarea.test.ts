import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { I9kTextarea as PublicI9kTextarea } from '../src';
import I9kField from '../src/components/I9kField.vue';
import I9kTextarea from '../src/components/I9kTextarea.vue';

describe('I9kTextarea', () => {
  it('is exported from the public entrypoint', () => {
    expect(PublicI9kTextarea).toBe(I9kTextarea);
  });

  it('forwards native attributes and emits the native string value', async () => {
    const wrapper = mount(I9kTextarea, {
      props: { modelValue: '' },
      attrs: { name: 'details', rows: 6, maxlength: 500, 'aria-label': 'Details' },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('name')).toBe('details');
    expect(textarea.attributes('rows')).toBe('6');
    await textarea.setValue('Project details');
    expect(wrapper.emitted('update:modelValue')).toEqual([['Project details']]);
  });

  it('consumes field IDs, error state, required state, and size', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Details', error: 'Required', required: true, size: 'lg' },
      slots: { default: () => h(I9kTextarea, { modelValue: '' }) },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(textarea.attributes('aria-invalid')).toBe('true');
    expect(textarea.attributes('required')).toBeDefined();
    expect(textarea.classes()).toContain('i9k-textarea--lg');
  });

  it.each(['grammar', 'spelling', 'false', false])(
    'preserves explicit aria-invalid="%s" without a field error',
    (ariaInvalid) => {
      const wrapper = mount(I9kTextarea, {
        props: { modelValue: '' },
        attrs: { 'aria-label': 'Details', 'aria-invalid': ariaInvalid },
      });

      expect(wrapper.get('textarea').attributes('aria-invalid')).toBe(String(ariaInvalid));
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('renders the %s UI size', (uiSize) => {
    const wrapper = mount(I9kTextarea, {
      props: { modelValue: '', uiSize },
      attrs: { 'aria-label': uiSize },
    });

    expect(wrapper.classes()).toContain(`i9k-textarea--${uiSize}`);
  });

  it.each(['vertical', 'horizontal', 'both', 'none'] as const)(
    'renders the %s resize mode',
    (resize) => {
      const wrapper = mount(I9kTextarea, {
        props: { modelValue: '', resize },
        attrs: { 'aria-label': resize },
      });

      expect(wrapper.attributes('data-resize')).toBe(resize);
    },
  );
});
