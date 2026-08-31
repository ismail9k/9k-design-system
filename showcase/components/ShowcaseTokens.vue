<script setup lang="ts">
const colorTokens = [
  '--primary-color',
  '--on-primary-color',
  '--accent-color',
  '--on-accent-color',
  '--theme-bg-color',
  '--theme-text-color',
  '--text-color-light',
  '--border-color',
  '--code-bg',
];

const spacingTokens = [
  '--spacing-1',
  '--spacing-2',
  '--spacing-3',
  '--spacing-4',
  '--spacing-6',
  '--spacing-8',
  '--spacing-10',
  '--spacing-13',
  '--spacing-18',
];

const controlTokens = [
  '--control-height-sm',
  '--control-height-md',
  '--control-height-lg',
  '--control-font-size-sm',
  '--control-font-size-md',
  '--control-font-size-lg',
  '--component-gap-sm',
  '--component-gap-md',
  '--component-gap-lg',
];

const radiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'];
</script>

<template>
  <div class="showcase-tokens">
    <section>
      <h3 id="tokens-color">Color</h3>
      <ul class="showcase-tokens__swatches">
        <li v-for="token in colorTokens" :key="token">
          <span class="showcase-tokens__swatch" :style="{ background: `var(${token})` }" />
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-spacing">Spacing</h3>
      <ul class="showcase-tokens__bars">
        <li v-for="token in spacingTokens" :key="token">
          <code>{{ token }}</code>
          <span class="showcase-tokens__bar" :style="{ inlineSize: `var(${token})` }" />
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-radius">Radius</h3>
      <ul class="showcase-tokens__swatches">
        <li v-for="token in radiusTokens" :key="token">
          <span class="showcase-tokens__swatch" :style="{ borderRadius: `var(${token})` }" />
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>

    <section>
      <h3 id="tokens-control">Control scale</h3>
      <p>
        Components declare local custom properties on their root class and redefine them per size
        modifier, drawing from this shared scale rather than from raw brand values.
      </p>
      <ul class="showcase-tokens__list">
        <li v-for="token in controlTokens" :key="token">
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.showcase-tokens {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-13);
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.showcase-tokens__bars,
.showcase-tokens__list {
  flex-direction: column;
  gap: var(--spacing-3);
}

.showcase-tokens__swatch {
  display: block;
  inline-size: 4rem;
  block-size: 4rem;
  border: 1px solid var(--border-color);
  background: var(--primary-color);
}

.showcase-tokens__bar {
  display: inline-block;
  block-size: 0.75rem;
  background: var(--accent-color);
}

code {
  font-size: 0.75rem;
}
</style>
