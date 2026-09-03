import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import I9kCollapsible from '../src/components/I9kCollapsible.vue';
import I9kFaqList from '../src/components/I9kFaqList.vue';

const items = [
  { question: 'What is included?', answer: 'Components, tokens, and typography.' },
  { question: 'Does it support Arabic?', answer: 'Yes, including RTL layouts.' },
];

describe('I9kFaqList', () => {
  it('renders every item through I9kCollapsible without changing its items API', () => {
    const wrapper = mount(I9kFaqList, { props: { items } });
    const disclosures = wrapper.findAllComponents(I9kCollapsible);

    expect(disclosures).toHaveLength(2);
    expect(wrapper.findAll('details')).toHaveLength(2);
    expect(wrapper.findAll('summary').map((summary) => summary.text())).toEqual([
      'What is included?',
      'Does it support Arabic?',
    ]);
    expect(wrapper.text()).toContain('Components, tokens, and typography.');
    expect(wrapper.text()).toContain('Yes, including RTL layouts.');
  });

  it('keeps FAQ disclosures independently expandable', async () => {
    const wrapper = mount(I9kFaqList, { props: { items } });
    const details = wrapper.findAll('details');

    details[0].element.open = true;
    await details[0].trigger('toggle');
    details[1].element.open = true;
    await details[1].trigger('toggle');

    expect(details.map((item) => item.element.open)).toEqual([true, true]);
  });
});
