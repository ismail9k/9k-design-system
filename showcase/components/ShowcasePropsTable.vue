<script setup lang="ts">
import type { ExtractedEmit, ExtractedProp } from '../extract/types';

defineProps<{ propRows: ExtractedProp[]; emitRows: ExtractedEmit[]; slotNames: string[] }>();
</script>

<template>
  <div class="showcase-api">
    <div v-if="propRows.length" class="showcase-api__scroll">
      <table>
        <caption>
          Props
        </caption>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in propRows" :key="prop.name">
            <td>
              <code>{{ prop.name }}</code>
              <span v-if="prop.required" class="showcase-api__required" title="Required">*</span>
            </td>
            <td>
              <code>{{ prop.type }}</code>
            </td>
            <td>
              <code v-if="prop.default">{{ prop.default }}</code>
              <span v-else>&mdash;</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="emitRows.length" class="showcase-api__scroll">
      <table>
        <caption>
          Emits
        </caption>
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emit in emitRows" :key="emit.name">
            <td>
              <code>{{ emit.name }}</code>
            </td>
            <td>
              <code>{{ emit.payload }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="slotNames.length" class="showcase-api__slots">
      Slots: <code v-for="slot in slotNames" :key="slot">{{ slot }}</code>
    </p>
  </div>
</template>

<style scoped>
.showcase-api {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Keeps a long union type inside its own scrollbar instead of widening the page. */
.showcase-api__scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

caption {
  margin-bottom: var(--spacing-3);
  text-align: start;
  font-weight: bold;
}

th,
td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
  text-align: start;
  vertical-align: top;
  white-space: nowrap;
}

.showcase-api__required {
  color: var(--accent-color);
}

.showcase-api__slots code {
  margin-inline-end: var(--spacing-3);
}
</style>
