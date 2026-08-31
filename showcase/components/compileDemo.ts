import { defineComponent } from 'vue';
import type { Component } from 'vue';

import * as library from '../../src/index';
import type { ShowcaseDemo } from '../registry/types';

/** Every I9k component, keyed by name, for the compiled demo's local registry. */
const libraryComponents = Object.fromEntries(
  Object.entries(library).filter(([name]) => name.startsWith('I9k')),
) as Record<string, Component>;

/**
 * Turns a demo's own code string into a renderable component. The string shown to the
 * reader is the string that renders, so the two cannot disagree.
 *
 * The code may have several root elements, which a template alone cannot express, so it
 * is wrapped in a <div> that the specimen styles as the demo stage.
 */
export const compileDemo = (demo: ShowcaseDemo): Component => {
  if (demo.render) return demo.render;

  const state = demo.state ?? {};

  return defineComponent({
    name: 'ShowcaseDemoStage',
    components: libraryComponents,
    data: () => ({ ...state }),
    template: `<div class="showcase-demo-stage">${demo.code}</div>`,
  });
};
