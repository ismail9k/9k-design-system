import { inject, provide, type ComputedRef, type InjectionKey } from 'vue';

import type { I9kComponentSize } from '../types/components';

export interface I9kFieldContext {
  controlId: ComputedRef<string>;
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
  required: ComputedRef<boolean>;
  size: ComputedRef<I9kComponentSize>;
  registerControl: () => () => void;
}

const i9kFieldKey: InjectionKey<I9kFieldContext> = Symbol('i9k-field');

export function provideI9kField(context: I9kFieldContext) {
  provide(i9kFieldKey, context);
}

export function useI9kField() {
  return inject(i9kFieldKey, undefined);
}

export function mergeI9kIds(...values: Array<string | undefined>) {
  const ids = values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []);
  const uniqueIds = [...new Set(ids)];
  return uniqueIds.length > 0 ? uniqueIds.join(' ') : undefined;
}

export function i9kStringAttr(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

export function hasI9kBooleanAttr(value: unknown) {
  return value !== undefined && value !== null && value !== false && value !== 'false';
}

export function omitI9kAttrs(attrs: Record<string, unknown>, names: string[]) {
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => !names.includes(name)));
}
