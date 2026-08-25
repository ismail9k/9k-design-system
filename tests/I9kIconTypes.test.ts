import { describe, expect, expectTypeOf, it } from 'vitest';

import icons from '../src/icons/paths.json';
import { I9K_ICON_NAMES, type I9kIconName } from '../src/types/icons';

describe('I9kIconName', () => {
  it('stays aligned with the runtime icon paths', () => {
    expect([...I9K_ICON_NAMES].sort()).toEqual(Object.keys(icons).sort());
    expectTypeOf<I9kIconName>().toEqualTypeOf<keyof typeof icons>();
  });
});
