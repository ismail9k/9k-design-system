import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { I9kSelect as PublicI9kSelect } from '../src';
import I9kField from '../src/components/I9kField.vue';
import I9kSelect from '../src/components/I9kSelect.vue';

describe('I9kSelect', () => {
  it('is exported from the public entrypoint', () => {
    expect(PublicI9kSelect).toBe(I9kSelect);
  });

  it('renders native options, forwards supported attributes, and emits a string', async () => {
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '' },
      attrs: { name: 'service', autocomplete: 'off', 'aria-label': 'Service' },
      slots: { default: '<option value="">Choose</option><option value="audit">Audit</option>' },
    });
    const select = wrapper.get('select');

    expect(select.attributes('name')).toBe('service');
    expect(wrapper.findAll('option')).toHaveLength(2);
    await select.setValue('audit');
    expect(wrapper.emitted('update:modelValue')).toEqual([['audit']]);
  });

  it('selects a non-first initial model value after slotted options render', () => {
    const wrapper = mount(I9kSelect, {
      props: { modelValue: 'audit' },
      attrs: { 'aria-label': 'Service' },
      slots: { default: '<option value="">Choose</option><option value="audit">Audit</option>' },
    });

    expect(wrapper.get('select').element.value).toBe('audit');
    expect(wrapper.findAll('option')[1].element.selected).toBe(true);
  });

  it('renders option groups from its default slot', () => {
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '' },
      attrs: { 'aria-label': 'Service' },
      slots: {
        default: '<optgroup label="Consulting"><option value="audit">Audit</option></optgroup>',
      },
    });

    expect(wrapper.get('optgroup').attributes('label')).toBe('Consulting');
    expect(wrapper.get('option').text()).toBe('Audit');
  });

  it('consumes enclosing field semantics', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Service', hint: 'Choose one', required: true, size: 'sm' },
      slots: { default: () => h(I9kSelect, { modelValue: '' }, () => h('option')) },
    });
    const select = wrapper.get('select');

    expect(select.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(select.attributes('aria-describedby')).toBe(
      wrapper.get('.i9k-field__hint').attributes('id'),
    );
    expect(select.attributes('required')).toBeDefined();
    expect(select.classes()).toContain('i9k-select--sm');
  });

  it.each(['grammar', 'spelling', 'false', false])(
    'preserves explicit aria-invalid="%s" without a field error',
    (ariaInvalid) => {
      const wrapper = mount(I9kSelect, {
        props: { modelValue: '' },
        attrs: { 'aria-label': 'Service', 'aria-invalid': ariaInvalid },
      });

      expect(wrapper.get('select').attributes('aria-invalid')).toBe(String(ariaInvalid));
    },
  );

  it('forces aria-invalid true when the enclosing field has an error', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Service', error: 'Choose one' },
      slots: {
        default: () =>
          h(I9kSelect, { modelValue: '', 'aria-invalid': 'grammar' }, () => h('option')),
      },
    });

    expect(wrapper.get('select').attributes('aria-invalid')).toBe('true');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s UI size', (uiSize) => {
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '', uiSize },
      attrs: { 'aria-label': uiSize },
    });

    expect(wrapper.classes()).toContain(`i9k-select--${uiSize}`);
  });

  it('rejects native multiple and size modes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(I9kSelect, {
      props: { modelValue: '' },
      attrs: { multiple: true, size: 4, 'aria-label': 'Services' },
    });

    expect(wrapper.attributes('multiple')).toBeUndefined();
    expect(wrapper.attributes('size')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('single-select'));
    warn.mockRestore();
  });
});
