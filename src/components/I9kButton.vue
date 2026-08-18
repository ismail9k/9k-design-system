<script setup lang="ts">
import { computed, useAttrs } from 'vue';

type Variant = 'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page';
const props = withDefaults(
  defineProps<{
    to?: string | Record<string, unknown> | null;
    href?: string | null;
    variant?: Variant;
    active?: boolean;
    type?: 'button' | 'submit' | 'reset';
    linkComponent?: string | object | null;
  }>(),
  { to: null, href: null, variant: 'default', active: false, type: 'button', linkComponent: null },
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
    :class="['btn', `btn--${variant}`, { 'is-active': active }]"
    ><slot
  /></component>
</template>
