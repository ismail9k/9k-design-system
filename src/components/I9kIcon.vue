<script setup lang="ts">
import icons from '../icons/paths.json';

export type I9kIconName = keyof typeof icons;
type IconDefinition = string | { viewBox: string; path: string };

const props = withDefaults(
  defineProps<{
    name: I9kIconName;
    title?: string;
    desc?: string;
    size?: string | number;
  }>(),
  { title: '', desc: '', size: '1.2em' },
);

const icon = icons[props.name] as IconDefinition;
const viewBox = typeof icon === 'string' ? '0 0 24 24' : icon.viewBox;
const path = typeof icon === 'string' ? icon : icon.path;
const isDecorative = !props.title && !props.desc;
</script>

<template>
  <svg
    class="i9k-icon"
    :viewBox="viewBox"
    :width="size"
    :height="size"
    :role="isDecorative ? undefined : 'img'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    v-bind="$attrs"
  >
    <title v-if="title">{{ title }}</title>
    <desc v-if="desc">{{ desc }}</desc>
    <path :d="path" />
  </svg>
</template>

<style scoped>
.i9k-icon {
  display: inline-block;
  flex: 0 0 auto;
  fill: currentColor;
  color: inherit;
  vertical-align: -0.125em;
}
</style>
