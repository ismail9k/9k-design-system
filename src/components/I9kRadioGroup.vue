<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';

import {
  i9kAriaInvalidAttr,
  i9kStringAttr,
  mergeI9kIds,
  omitI9kAttrs,
} from '../composables/i9kField';
import type { I9kComponentSize } from '../types/components';
import type { I9kRadioOption } from '../types/forms';

type I9kRadioGroupVariant = 'default' | 'card';
type I9kRadioGroupOrientation = 'horizontal' | 'vertical';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: readonly I9kRadioOption[];
    legend: string;
    name?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    size?: I9kComponentSize;
    variant?: I9kRadioGroupVariant;
    orientation?: I9kRadioGroupOrientation;
  }>(),
  {
    name: undefined,
    hint: undefined,
    error: undefined,
    required: false,
    disabled: false,
    size: 'md',
    variant: 'default',
    orientation: 'vertical',
  },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const attrs = useAttrs();
const groupId = useId();
const resolvedName = computed(() => props.name ?? `${groupId}-group`);
const hintId = computed(() => `${groupId}-hint`);
const errorId = computed(() => `${groupId}-error`);
const groupDescriptionId = computed(() =>
  props.error ? errorId.value : props.hint ? hintId.value : undefined,
);
const describedBy = computed(() =>
  mergeI9kIds(i9kStringAttr(attrs['aria-describedby']), groupDescriptionId.value),
);
const invalid = computed(() => (props.error ? 'true' : i9kAriaInvalidAttr(attrs['aria-invalid'])));
const fieldsetAttrs = computed(() =>
  omitI9kAttrs(attrs, ['aria-describedby', 'aria-invalid', 'class']),
);
</script>

<template>
  <fieldset
    v-bind="fieldsetAttrs"
    :class="[
      attrs.class,
      'i9k-radio-group',
      `i9k-radio-group--${props.size}`,
      `i9k-radio-group--${props.variant}`,
      `i9k-radio-group--${props.orientation}`,
    ]"
    :disabled="props.disabled"
    :aria-invalid="invalid"
    :aria-describedby="describedBy"
  >
    <legend class="i9k-radio-group__legend">{{ props.legend }}</legend>
    <div class="i9k-radio-group__options">
      <label v-for="(option, index) in props.options" :key="index" class="i9k-radio-group__option">
        <input
          :id="`${groupId}-option-${index}`"
          type="radio"
          :name="resolvedName"
          :value="option.value"
          :checked="props.modelValue === option.value"
          :required="props.required"
          :disabled="props.disabled || option.disabled"
          :aria-describedby="
            mergeI9kIds(
              option.description ? `${groupId}-option-${index}-description` : undefined,
              groupDescriptionId,
            )
          "
          @change="$emit('update:modelValue', option.value)"
        />
        <span class="i9k-radio-group__copy">
          <span class="i9k-radio-group__label">{{ option.label }}</span>
          <span
            v-if="option.description"
            :id="`${groupId}-option-${index}-description`"
            class="i9k-radio-group__description"
          >
            {{ option.description }}
          </span>
        </span>
      </label>
    </div>
    <p v-if="props.hint && !props.error" :id="hintId" class="i9k-radio-group__hint">
      {{ props.hint }}
    </p>
    <p v-if="props.error" :id="errorId" class="i9k-radio-group__error" role="alert">
      {{ props.error }}
    </p>
  </fieldset>
</template>

<style scoped>
.i9k-radio-group {
  --i9k-radio-gap: var(--component-gap-md);
  --i9k-radio-padding: var(--spacing-8);
  --i9k-radio-font-size: var(--control-font-size-md);

  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.i9k-radio-group--sm {
  --i9k-radio-gap: var(--component-gap-sm);
  --i9k-radio-padding: var(--spacing-6);
  --i9k-radio-font-size: var(--control-font-size-sm);
}

.i9k-radio-group--lg {
  --i9k-radio-gap: var(--component-gap-lg);
  --i9k-radio-padding: var(--spacing-11);
  --i9k-radio-font-size: var(--control-font-size-lg);
}

.i9k-radio-group__legend {
  margin-block-end: var(--spacing-5);
  font-weight: 700;
}

.i9k-radio-group__options {
  display: flex;
  gap: var(--i9k-radio-gap);
}

.i9k-radio-group--vertical .i9k-radio-group__options {
  flex-direction: column;
}

.i9k-radio-group--horizontal .i9k-radio-group__options {
  flex-flow: row wrap;
}

.i9k-radio-group__option {
  display: flex;
  gap: var(--spacing-5);
  align-items: flex-start;
}

.i9k-radio-group__copy {
  display: flex;
  flex-direction: column;
  font-size: var(--i9k-radio-font-size);
}

.i9k-radio-group__description,
.i9k-radio-group__hint {
  color: var(--text-color-light);
}

.i9k-radio-group__error {
  color: var(--accent-color);
  font-weight: 600;
}

.i9k-radio-group--card .i9k-radio-group__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.i9k-radio-group--card .i9k-radio-group__option {
  position: relative;
  min-height: 7rem;
  padding: var(--i9k-radio-padding);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  cursor: pointer;
  transition: var(--transition);
}

.i9k-radio-group--card:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.i9k-radio-group--card:disabled .i9k-radio-group__option {
  cursor: not-allowed;
}

.i9k-radio-group--card:not(:disabled) .i9k-radio-group__option:has(input:disabled) {
  cursor: not-allowed;
  opacity: 0.5;
}

.i9k-radio-group--card .i9k-radio-group__option:has(input:checked) {
  border-color: var(--primary-color);
  background: var(--primary-color-alpha-12);
  box-shadow: inset 0 0 0 2px var(--primary-color-alpha-12);
}

.i9k-radio-group--card .i9k-radio-group__option:not(:has(input:disabled)):hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.i9k-radio-group--card .i9k-radio-group__option:has(input:focus-visible) {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}

.i9k-radio-group--card input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

@media (max-width: 640px) {
  .i9k-radio-group--card .i9k-radio-group__options {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .i9k-radio-group--card .i9k-radio-group__option {
    transition: none;
  }

  .i9k-radio-group--card .i9k-radio-group__option:hover {
    transform: none;
  }
}
</style>
