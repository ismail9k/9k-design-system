<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { I9kComponentSize } from '../types/components';

type Variant = 'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page';
const props = withDefaults(
  defineProps<{
    to?: string | Record<string, unknown> | null;
    href?: string | null;
    variant?: Variant;
    size?: I9kComponentSize;
    active?: boolean;
    type?: 'button' | 'submit' | 'reset';
    linkComponent?: string | object | null;
  }>(),
  {
    to: null,
    href: null,
    variant: 'default',
    size: 'md',
    active: false,
    type: 'button',
    linkComponent: null,
  },
);
const attrs = useAttrs();
const isLink = computed(() => props.to !== null || props.href !== null);
const destination = computed(() => props.to ?? props.href ?? undefined);
const tag = computed(() => props.linkComponent ?? (isLink.value ? 'a' : 'button'));
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    :to="linkComponent && to !== null ? to : undefined"
    :href="!linkComponent && isLink ? destination : undefined"
    :type="!isLink ? type : undefined"
    :class="[
      'btn',
      `btn--${variant}`,
      'i9k-button',
      `i9k-button--${variant}`,
      `i9k-button--${size}`,
      { 'is-active': active },
    ]"
    ><slot
  /></component>
</template>

<style scoped>
.i9k-button {
  --i9k-button-height: var(--control-height-md);
  --i9k-button-padding: var(--spacing-8);
  --i9k-button-wide-padding: var(--spacing-11);
  --i9k-button-page-padding: var(--spacing-10);
  --i9k-button-font-size: var(--control-font-size-md);

  display: inline-flex;
  min-height: var(--i9k-button-height);
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--i9k-button-font-size);
  text-decoration: none;
  transition: var(--transition);
}

.i9k-button--sm {
  --i9k-button-height: var(--control-height-sm);
  --i9k-button-padding: var(--spacing-6);
  --i9k-button-wide-padding: var(--spacing-8);
  --i9k-button-page-padding: var(--spacing-8);
  --i9k-button-font-size: var(--control-font-size-sm);
}

.i9k-button--lg {
  --i9k-button-height: var(--control-height-lg);
  --i9k-button-padding: var(--spacing-11);
  --i9k-button-wide-padding: var(--spacing-13);
  --i9k-button-page-padding: var(--spacing-11);
  --i9k-button-font-size: var(--control-font-size-lg);
}

.i9k-button--default {
  gap: var(--spacing-5);
  padding: 0 var(--i9k-button-padding);
  border: 1px solid currentColor;
  border-radius: var(--radius-sm);
  background: var(--white-color-alpha-20);
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--default:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
}

.i9k-button--primary {
  padding: 0 var(--i9k-button-wide-padding);
  border-radius: var(--radius-pill);
  background: var(--primary-color);
  color: var(--on-primary-color);
  font-weight: 700;
}

.i9k-button--primary:hover {
  background: var(--accent-color);
  color: var(--on-accent-color);
  transform: translateY(-1px);
}

.i9k-button--link {
  min-height: auto;
  padding: 0;
  background: transparent;
  color: var(--primary-text-color);
  font-weight: 700;
  text-decoration-color: var(--accent-color);
}

.i9k-button--link:hover {
  text-decoration: underline;
  text-decoration-color: var(--accent-color);
}

.i9k-button--filter {
  padding: 0 var(--i9k-button-padding);
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--pagination {
  padding: 0 var(--i9k-button-page-padding);
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--page {
  width: var(--i9k-button-height);
  height: var(--i9k-button-height);
  min-height: 0;
  padding: 0;
  border: 1px solid var(--dark-color-alpha-20);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--theme-text-color);
  font-weight: 500;
}

.i9k-button--filter:hover,
.i9k-button--pagination:hover:not(:disabled),
.i9k-button--page:hover {
  border-color: var(--accent-color);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
}

.i9k-button--filter.is-active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--on-primary-color);
}

.i9k-button--page.is-active {
  border-color: var(--accent-color);
  background: var(--accent-color);
  color: var(--on-accent-color);
}

.i9k-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

:global(.dark .i9k-button--filter),
:global(.dark .i9k-button--pagination),
:global(.dark .i9k-button--page) {
  border-color: var(--white-color-alpha-20);
}

@media (prefers-reduced-motion: reduce) {
  .i9k-button {
    transition: none;
  }

  .i9k-button--primary:hover {
    transform: none;
  }
}
</style>
