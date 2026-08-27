<script setup lang="ts">
import { extracted } from 'virtual:showcase-data';
import { computed, ref } from 'vue';

import ShowcaseRail from './components/ShowcaseRail.vue';
import ShowcaseSpecimen from './components/ShowcaseSpecimen.vue';
import ShowcaseTokens from './components/ShowcaseTokens.vue';
import { entries } from './registry';
import { mergeRegistry } from './registry/merge';
import { RULES } from './registry/rules';
import { SECTIONS } from './registry/sections';

const components = mergeRegistry(entries, extracted);
// 'install' and 'rules' are rendered explicitly in the template, so they must be
// excluded here — leaving them in would emit a second element with the same id.
const bySection = SECTIONS.filter(
  (section) => section.id !== 'install' && section.id !== 'rules',
).map((section) => ({
  ...section,
  components: components.filter((component) => component.section === section.id),
}));

const theme = ref<'light' | 'dark'>('light');
const direction = ref<'ltr' | 'rtl'>('ltr');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
  document.documentElement.classList.toggle('light', theme.value === 'light');
};

const toggleDirection = () => {
  direction.value = direction.value === 'ltr' ? 'rtl' : 'ltr';
};

const installCode = 'npm install @ismail9k/9k-design-system';
const styleCode = "import '@ismail9k/9k-design-system/style.css';";
const componentCount = computed(() => components.length);
</script>

<template>
  <div class="showcase">
    <header class="showcase__header">
      <h1>9k Design System</h1>
      <p>
        Every one of the {{ componentCount }} components in <code>@ismail9k/9k-design-system</code>,
        with props read from source, live demos, and a copy-paste prompt per component.
        Machine-readable at <a href="/components.json">/components.json</a> and
        <a href="/llms.txt">/llms.txt</a>.
      </p>
      <div class="showcase__toggles">
        <button type="button" @click="toggleTheme">Theme: {{ theme }}</button>
        <button type="button" @click="toggleDirection">Direction: {{ direction }}</button>
      </div>
    </header>

    <div class="showcase__body">
      <ShowcaseRail />

      <main :dir="direction">
        <section id="section-install">
          <h2>Install</h2>
          <pre><code>{{ installCode }}</code></pre>
          <p>Import the stylesheet once, at your application entry:</p>
          <pre><code>{{ styleCode }}</code></pre>
          <p>
            In a Vue Router app, pass <code>link-component="RouterLink"</code> to
            <code>I9kButton</code> so its link form renders a router link.
          </p>
        </section>

        <section v-for="section in bySection" :id="`section-${section.id}`" :key="section.id">
          <h2>{{ section.title }}</h2>
          <ShowcaseTokens v-if="section.id === 'tokens'" />
          <ShowcaseSpecimen
            v-for="component in section.components"
            :key="component.name"
            :component="component"
          />
        </section>

        <section id="section-rules">
          <h2>Rules for agents</h2>
          <p>
            These are the constraints a props table cannot express. They hold for every component
            above.
          </p>
          <ol class="showcase__rules">
            <li v-for="rule in RULES" :key="rule">{{ rule }}</li>
          </ol>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  max-inline-size: 72rem;
  margin-inline: auto;
  padding: var(--spacing-13) var(--spacing-8) var(--spacing-18);
}

.showcase__body {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: var(--spacing-13);
}

@media (max-width: 900px) {
  .showcase__body {
    grid-template-columns: minmax(0, 1fr);
  }
}

.showcase__toggles {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

section[id] {
  scroll-margin-top: 6rem;
}

pre {
  padding: var(--spacing-6);
  overflow-x: auto;
  border-radius: var(--radius-md);
  background: var(--code-bg);
}

.showcase__rules li {
  margin-bottom: var(--spacing-4);
}
</style>
