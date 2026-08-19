<script setup lang="ts">
import { computed } from 'vue';
import I9kIcon from './I9kIcon.vue';

const props = defineProps<{ repo: string }>();
const href = computed(() => `https://github.com/${props.repo}`);
</script>

<template>
  <div class="surface github-embed">
    <a class="github-embed__link" :href="href" target="_blank" rel="noopener noreferrer">
      <I9kIcon name="github" size="2em" title="GitHub" />
      <span class="github-embed__repo">{{ repo }}</span>
    </a>
  </div>
</template>

<style scoped>
.github-embed {
  display: block;
  width: fit-content;
  margin: var(--spacing-8) 0;
  padding: var(--spacing-11);
}
.github-embed__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
  color: var(--theme-text-color);
  text-decoration: none;
}
.github-embed__link:hover .github-embed__repo {
  color: var(--primary-text-color);
  text-decoration: underline;
}
.github-embed__repo {
  font-size: 1.1rem;
  font-weight: 600;
  transition: var(--transition);
}
</style>
