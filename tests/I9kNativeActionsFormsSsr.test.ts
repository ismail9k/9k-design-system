import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import {
  I9kButtonGroup,
  I9kField,
  I9kIconButton,
  I9kInput,
  I9kRadioGroup,
  I9kSelect,
  I9kTextarea,
} from '../src';

describe('native action and form SSR', () => {
  it('renders every Phase 3A component without browser-only setup access', async () => {
    const app = createSSRApp({
      components: {
        I9kButtonGroup,
        I9kField,
        I9kIconButton,
        I9kInput,
        I9kRadioGroup,
        I9kSelect,
        I9kTextarea,
      },
      setup: () => ({ options: [{ label: 'Audit', value: 'audit' }] }),
      template: `
        <main>
          <I9kButtonGroup label="Actions"><I9kIconButton icon="home" label="Home" /></I9kButtonGroup>
          <I9kField label="Name"><I9kInput model-value="" /></I9kField>
          <I9kField label="Details"><I9kTextarea model-value="" /></I9kField>
          <I9kField label="Service"><I9kSelect model-value=""><option value="audit">Audit</option></I9kSelect></I9kField>
          <I9kRadioGroup model-value="audit" :options="options" legend="Intent" />
        </main>
      `,
    });

    const html = await renderToString(app);
    expect(html).toContain('i9k-icon-button--md');
    expect(html).toContain('i9k-input--md');
    expect(html).toContain('i9k-textarea--md');
    expect(html).toContain('i9k-select--md');
    expect(html).toContain('i9k-radio-group--md');
  });

  it('renders I9kIconButton when the Node process global is unavailable', async () => {
    vi.stubGlobal('process', undefined);

    try {
      const html = await renderToString(
        createSSRApp(I9kIconButton, { icon: 'home', label: 'Home' }),
      );

      expect(html).toContain('aria-label="Home"');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('marks the non-first I9kSelect model option as selected during SSR', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(I9kSelect, { modelValue: 'audit', 'aria-label': 'Service' }, () => [
            h('option', { value: '' }, 'Choose'),
            h('option', { value: 'audit' }, 'Audit'),
          ]),
      }),
    );

    expect(html).toContain('<option value="audit" selected>Audit</option>');
  });
});
