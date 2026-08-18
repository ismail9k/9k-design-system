<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    title: string;
    imageSrc?: string | null;
    imageAlt?: string;
    watermark?: string;
    eager?: boolean;
  }>(),
  { imageSrc: null, imageAlt: '', watermark: '9k', eager: false },
);
const alt = computed(() => props.imageAlt || `${props.title} article header`);
</script>

<template>
  <figure v-if="imageSrc" class="i9k-article-header">
    <img
      :src="imageSrc"
      :alt="alt"
      width="1200"
      height="600"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
    />
  </figure>
  <div v-else class="i9k-article-header i9k-article-header--fallback" aria-hidden="true">
    <span>#{{ watermark }}</span>
  </div>
</template>

<style scoped>
.i9k-article-header {
  aspect-ratio: 2 / 1;
  max-height: 420px;
  margin: 0 0 var(--spacing-13);
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}
.i9k-article-header img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.i9k-article-header--fallback {
  display: flex;
  align-items: flex-end;
  max-height: none;
  padding: var(--spacing-10);
  background:
    radial-gradient(120% 150% at 85% 10%, hsl(23 97% 46% / 0.5), transparent 48%),
    linear-gradient(135deg, hsl(143 58% 29%), hsl(143 62% 15%));
}
.i9k-article-header--fallback span {
  color: hsl(0 0% 100% / 0.22);
  font-family: var(--font-serif);
  font-size: clamp(2rem, 7vw, 4.5rem);
  font-style: italic;
  font-weight: 700;
  line-height: 1;
  user-select: none;
}
</style>
