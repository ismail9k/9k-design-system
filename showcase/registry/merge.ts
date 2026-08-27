import type { ExtractedComponent } from '../extract/types';
import type { ShowcaseComponent, ShowcaseEntry } from './types';

export const mergeRegistry = (
  entries: ShowcaseEntry[],
  extracted: ExtractedComponent[],
): ShowcaseComponent[] => {
  const byName = new Map(extracted.map((component) => [component.name, component]));

  return entries.map((entry) => {
    const source = byName.get(entry.name);
    if (!source) {
      throw new Error(
        `Registry entry "${entry.name}" has no matching component at src/components/${entry.name}.vue`,
      );
    }
    return {
      ...entry,
      props: source.props,
      emits: source.emits,
      slots: source.slots,
      referencedTypes: source.referencedTypes,
    };
  });
};
