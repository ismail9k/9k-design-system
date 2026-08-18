<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{ date: string | Date; linked?: boolean; locale?: string }>(),
  { linked: false, locale: 'en' },
);
const formattedDate = computed(() =>
  new Intl.DateTimeFormat(props.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(props.date instanceof Date ? props.date : new Date(`${props.date}T00:00:00Z`)),
);
</script>

<template>
  <div class="timeline">
    <p class="timeline__time">{{ formattedDate }}</p>
    <div class="timeline__rail" />
    <div class="timeline__card" :class="{ 'timeline__card--linked': linked }">
      <div class="timeline__main"><slot /></div>
      <slot name="thumbnail" />
    </div>
  </div>
</template>
