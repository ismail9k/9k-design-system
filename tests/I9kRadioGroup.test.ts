import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kRadioGroup from '../src/components/I9kRadioGroup.vue';

const options = [
  { label: 'Audit', value: 'audit', description: 'Review an existing product' },
  { label: 'Build', value: 'build', description: 'Create a new product' },
  { label: 'Advisory', value: 'advisory', disabled: true },
] as const;

describe('I9kRadioGroup', () => {
  it('renders a native named fieldset and emits selection', async () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: 'audit', options, legend: 'Choose a service', name: 'service' },
    });
    const radios = wrapper.findAll('input[type="radio"]');

    expect(wrapper.get('fieldset').get('legend').text()).toBe('Choose a service');
    expect(radios.map((radio) => radio.attributes('name'))).toEqual([
      'service',
      'service',
      'service',
    ]);
    expect(radios[0].attributes('checked')).toBeDefined();
    await radios[1].setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([['build']]);
  });

  it('associates option descriptions and group errors', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: '', options, legend: 'Service', error: 'Choose one' },
    });
    const firstRadio = wrapper.get('input[value="audit"]');
    const error = wrapper.get('[role="alert"]');

    expect(firstRadio.attributes('aria-describedby')?.split(' ')).toEqual([
      wrapper.get('.i9k-radio-group__description').attributes('id'),
      error.attributes('id'),
    ]);
    expect(wrapper.get('fieldset').attributes('aria-invalid')).toBe('true');
  });

  it('honors disabled group and option states', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: '', options, legend: 'Service', disabled: true },
    });

    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input[value="advisory"]').attributes('disabled')).toBeDefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s card size', (size) => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: 'audit', options, legend: 'Service', variant: 'card', size },
    });
    expect(wrapper.get('fieldset').classes()).toEqual(
      expect.arrayContaining(['i9k-radio-group--card', `i9k-radio-group--${size}`]),
    );
  });

  it('uses index-based IDs and associates the fieldset with its hint', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: {
        modelValue: '',
        options: [{ label: 'A value', value: 'contains spaces / and symbols' }],
        legend: 'Service',
        hint: 'Select one service',
      },
    });
    const radio = wrapper.get('input[type="radio"]');
    const hint = wrapper.get('.i9k-radio-group__hint');

    expect(radio.attributes('id')).toMatch(/-option-0$/);
    expect(radio.attributes('id')).not.toContain('contains spaces');
    expect(wrapper.get('fieldset').attributes('aria-describedby')).toBe(hint.attributes('id'));
  });

  it('marks every radio required when required', () => {
    const wrapper = mount(I9kRadioGroup, {
      props: { modelValue: '', options, legend: 'Service', required: true },
    });

    expect(
      wrapper
        .findAll('input[type="radio"]')
        .every((radio) => radio.attributes('required') !== undefined),
    ).toBe(true);
  });
});
