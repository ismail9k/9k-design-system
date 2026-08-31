<script setup lang="ts">
import { SECTIONS } from '../registry/sections';
</script>

<template>
  <nav class="showcase-rail" aria-label="Sections">
    <ul>
      <li v-for="section in SECTIONS" :key="section.id">
        <a :href="`#section-${section.id}`">{{ section.title }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.showcase-rail {
  position: sticky;
  top: var(--spacing-8);
  align-self: start;
}

ul {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  font-size: var(--text-size-1);
  color: var(--text-color-light);
  text-decoration: none;
}

a:hover {
  color: var(--theme-text-color);
}

@media (max-width: 900px) {
  .showcase-rail {
    display: none;
  }
}
</style>
