<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { I9kComponentSize, I9kIconButtonVariant } from '../types/components';
import type { I9kIconName } from '../types/icons';
import { omitI9kAttrs } from '../composables/i9kField';
import I9kIcon from './I9kIcon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    icon: I9kIconName;
    label: string;
    to?: string | Record<string, unknown> | null;
    href?: string | null;
    variant?: I9kIconButtonVariant;
    size?: I9kComponentSize;
    type?: 'button' | 'submit' | 'reset';
    linkComponent?: string | object | null;
  }>(),
  {
    to: null,
    href: null,
    variant: 'secondary',
    size: 'md',
    type: 'button',
    linkComponent: null,
  },
);

const attrs = useAttrs();
const rootAttrs = computed(() =>
  omitI9kAttrs(attrs, ['aria-label', 'class', 'href', 'to', 'type']),
);
const isLink = computed(() => props.to !== null || props.href !== null);
const destination = computed(() => props.to ?? props.href ?? undefined);
const tag = computed(() => props.linkComponent ?? (isLink.value ? 'a' : 'button'));
const iconSize = computed(() => ({ sm: '1rem', md: '1.2rem', lg: '1.4rem' })[props.size]);
const isDevelopment = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

if (isDevelopment && !props.label.trim()) {
  console.warn('I9kIconButton requires a non-empty label for its accessible name.');
}
</script>

<template>
  <component
    :is="tag"
    v-bind="rootAttrs"
    :to="linkComponent && to !== null ? to : undefined"
    :href="!linkComponent && isLink ? destination : undefined"
    :type="!isLink ? type : undefined"
    :aria-label="label"
    :class="[
      attrs.class,
      'i9k-icon-button',
      `i9k-icon-button--${variant}`,
      `i9k-icon-button--${size}`,
    ]"
  >
    <I9kIcon :name="icon" :size="iconSize" />
  </component>
</template>

<style scoped>
.i9k-icon-button {
  display: inline-flex;
  width: var(--control-height-md);
  height: var(--control-height-md);
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid currentColor;
  border-radius: var(--radius-circle);
  appearance: none;
  cursor: pointer;
  color: var(--theme-text-color);
  text-decoration: none;
  transition: var(--transition);
}

.i9k-icon-button--sm {
  width: var(--control-height-sm);
  height: var(--control-height-sm);
}

.i9k-icon-button--lg {
  width: var(--control-height-lg);
  height: var(--control-height-lg);
}

.i9k-icon-button--secondary {
  background: var(--white-color-alpha-20);
}

.i9k-icon-button--primary {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--on-primary-color);
}

.i9k-icon-button--ghost {
  border-color: transparent;
  background: transparent;
}

.i9k-icon-button:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
}

.i9k-icon-button--primary:hover {
  border-color: var(--accent-color);
  background: var(--accent-color);
  transform: translateY(-1px);
}

.i9k-icon-button:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.i9k-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .i9k-icon-button {
    transition: none;
  }

  .i9k-icon-button--primary:hover {
    transform: none;
  }
}
</style>
