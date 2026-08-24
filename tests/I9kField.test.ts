import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import I9kField from '../src/components/I9kField.vue';

describe('I9kField', () => {
  it('associates its label and hint with an arbitrary native control', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Email', hint: 'Use your work address', controlId: 'email' },
      slots: {
        default: ({ controlId, describedBy, required }) =>
          h('input', { id: controlId, 'aria-describedby': describedBy, required }),
      },
    });

    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(
      wrapper.get('.i9k-field__hint').attributes('id'),
    );
  });

  it('shows an alert error instead of the hint and exposes invalid slot state', () => {
    const wrapper = mount(I9kField, {
      props: { label: 'Email', hint: 'Hint', error: 'Enter an email' },
      slots: {
        default: ({ controlId, describedBy, invalid }) =>
          h('input', { id: controlId, 'aria-describedby': describedBy, 'aria-invalid': invalid }),
      },
    });

    const error = wrapper.get('[role="alert"]');
    expect(wrapper.text()).not.toContain('Hint');
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(error.attributes('id'));
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    const wrapper = mount(I9kField, {
      props: { label: 'Name', size },
      slots: { default: ({ controlId }) => h('input', { id: controlId }) },
    });

    expect(wrapper.classes()).toContain(`i9k-field--${size}`);
  });

  it('warns when it has no label content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(I9kField, { slots: { default: '<input />' } });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('label'));
    warn.mockRestore();
  });
});
