import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kInput from '../src/components/I9kInput.vue';

describe('I9kInput', () => {
  it('forwards native attributes to the input and emits its value', async () => {
    const wrapper = mount(I9kInput, {
      props: { modelValue: '', label: 'Email' },
      attrs: { name: 'email', autocomplete: 'email' },
    });
    const input = wrapper.get('input');

    expect(input.attributes('name')).toBe('email');
    expect(input.attributes('autocomplete')).toBe('email');
    expect(wrapper.attributes('name')).toBeUndefined();

    await input.setValue('person@example.com');
    expect(wrapper.emitted('update:modelValue')).toEqual([['person@example.com']]);
  });

  it('forwards the native size attribute to the input', () => {
    const wrapper = mount(I9kInput, {
      props: { modelValue: '', label: 'Search' },
      attrs: { size: 32 },
    });

    expect(wrapper.get('input').attributes('size')).toBe('32');
  });

  it('associates an error and suppresses the hint', () => {
    const wrapper = mount(I9kInput, {
      props: {
        modelValue: '',
        label: 'Email',
        hint: 'Use your work address',
        error: 'Enter a valid email',
      },
    });
    const input = wrapper.get('input');
    const error = wrapper.get('[role="alert"]');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'));
    expect(wrapper.text()).not.toContain('Use your work address');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kInput, {
      props: { modelValue: '', label: 'Name', uiSize: size },
    });

    expect(wrapper.get('.i9k-field').classes()).toContain(`i9k-field--${size}`);
    expect(wrapper.get('input').classes()).toContain(`i9k-input--${size}`);
  });
});
