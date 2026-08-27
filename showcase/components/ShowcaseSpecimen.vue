<script setup lang="ts">
import ShowcasePromptBlock from './ShowcasePromptBlock.vue';
import ShowcasePropsTable from './ShowcasePropsTable.vue';
import type { ShowcaseComponent } from '../registry/types';

defineProps<{ component: ShowcaseComponent }>();
</script>

<template>
  <article class="showcase-specimen">
    <h3 :id="component.name">{{ component.name }}</h3>
    <p class="showcase-specimen__summary">{{ component.summary }}</p>

    <section v-for="demo in component.demos" :key="demo.label" class="showcase-specimen__demo">
      <h4>{{ demo.label }}</h4>
      <div v-if="demo.render" class="showcase-specimen__stage">
        <component :is="demo.render" />
      </div>
      <pre class="showcase-specimen__code"><code>{{ demo.code }}</code></pre>
    </section>

    <div v-if="component.gotchas.length" class="showcase-specimen__gotchas">
      <h4>Watch out</h4>
      <ul>
        <li v-for="gotcha in component.gotchas" :key="gotcha">{{ gotcha }}</li>
      </ul>
    </div>

    <ShowcasePropsTable
      :prop-rows="component.props"
      :emit-rows="component.emits"
      :slot-names="component.slots"
    />

    <ShowcasePromptBlock :prompt="component.agentPrompt" />
  </article>
</template>

<style scoped>
.showcase-specimen {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  padding-block: var(--spacing-13);
  border-bottom: 1px solid var(--border-color);
  /* Matches the rail's offset so an anchor jump does not hide the heading. */
  scroll-margin-top: 6rem;
}

.showcase-specimen h3 {
  margin: 0;
}

.showcase-specimen h4 {
  margin: 0 0 var(--spacing-3);
  font-size: 0.875rem;
  color: var(--text-color-light);
}

.showcase-specimen__stage {
  padding: var(--spacing-8);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
}

.showcase-specimen__code {
  margin: var(--spacing-4) 0 0;
  padding: var(--spacing-6);
  overflow-x: auto;
  border-radius: var(--radius-md);
  background: var(--code-bg);
  font-size: 0.8125rem;
}
</style>
