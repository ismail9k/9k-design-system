import { mount } from '@vue/test-utils';
import { describe, expect, expectTypeOf, it } from 'vitest';

import I9kCheckboxGroup from '../src/components/I9kCheckboxGroup.vue';

const options = [
  { label: 'Engineering', value: 'engineering', description: 'Technical track' },
  { label: 'Design', value: 'design' },
  { label: 'Advisory', value: 'advisory', disabled: true },
] as const;

type CheckboxGroupProps = InstanceType<typeof I9kCheckboxGroup>['$props'];

describe('I9kCheckboxGroup', () => {
  it('renders native named inputs and immutably adds and removes values', async () => {
    const selected = ['engineering'];
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: selected, options, legend: 'Choose tracks', name: 'tracks' },
    });
    const inputs = wrapper.findAll('input[type="checkbox"]');

    expect(inputs.map((input) => input.attributes('name'))).toEqual(['tracks', 'tracks', 'tracks']);
    expect(inputs[0].attributes('checked')).toBeDefined();
    expect(wrapper.findAll('.i9k-checkbox-group__mark')).toHaveLength(3);

    await inputs[1].setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([[['engineering', 'design']]]);
    expect(selected).toEqual(['engineering']);

    await wrapper.setProps({ modelValue: ['engineering', 'design'] });
    await wrapper.get('input[value="engineering"]').setValue(false);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['design']]);
  });

  it('requires at least one option only while the group is empty', async () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose tracks', required: true },
    });

    expect(
      wrapper.findAll('input').every((input) => input.attributes('required') !== undefined),
    ).toBe(true);

    await wrapper.setProps({ modelValue: ['engineering'] });
    expect(
      wrapper.findAll('input').every((input) => input.attributes('required') === undefined),
    ).toBe(true);
  });

  it('remains required when the model contains only an unknown value', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: ['removed'], options, legend: 'Choose tracks', required: true },
    });
    const enabledInputs = wrapper.findAll('input:not(:disabled)');

    expect(enabledInputs.every((input) => input.attributes('required') !== undefined)).toBe(true);
  });

  it('remains required when the model contains only a disabled option', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: ['advisory'], options, legend: 'Choose tracks', required: true },
    });
    const enabledInputs = wrapper.findAll('input:not(:disabled)');

    expect(enabledInputs.every((input) => input.attributes('required') !== undefined)).toBe(true);
  });

  it('links descriptions and errors while forwarding consumer attrs', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: {
        modelValue: [],
        options,
        legend: 'Choose',
        hint: 'One or more',
        error: 'Required',
      },
      attrs: {
        'aria-describedby': 'note',
        'aria-invalid': 'spelling',
        class: 'consumer',
        'data-testid': 'group',
      },
    });
    const fieldset = wrapper.get('fieldset');
    const error = wrapper.get('[role="alert"]');

    expect(wrapper.find('.i9k-checkbox-group__hint').exists()).toBe(false);
    expect(fieldset.attributes('aria-invalid')).toBe('true');
    expect(fieldset.attributes('aria-describedby')?.split(' ')).toEqual([
      'note',
      error.attributes('id'),
    ]);
    expect(
      wrapper.get('input[value="engineering"]').attributes('aria-describedby')?.split(' '),
    ).toEqual([
      wrapper.get('.i9k-checkbox-group__description').attributes('id'),
      error.attributes('id'),
    ]);
    expect(fieldset.classes()).toContain('consumer');
    expect(fieldset.attributes('data-testid')).toBe('group');
  });

  it('renders the hint inside the legend and honors disabled states', () => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose', hint: 'One or more', disabled: true },
    });
    const hint = wrapper.get('.i9k-checkbox-group__hint');

    expect(hint.element.parentElement?.tagName).toBe('LEGEND');
    expect(wrapper.get('fieldset').attributes('aria-describedby')).toBe(hint.attributes('id'));
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input[value="advisory"]').attributes('disabled')).toBeDefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s horizontal size', (size) => {
    const wrapper = mount(I9kCheckboxGroup, {
      props: { modelValue: [], options, legend: 'Choose', size, orientation: 'horizontal' },
    });

    expect(wrapper.get('fieldset').classes()).toEqual(
      expect.arrayContaining([`i9k-checkbox-group--${size}`, 'i9k-checkbox-group--horizontal']),
    );
    expectTypeOf<CheckboxGroupProps['size']>().toEqualTypeOf<'sm' | 'md' | 'lg' | undefined>();
  });
});
