import { extracted } from 'virtual:showcase-data';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

import { buildLlmsTxt, buildManifest } from './manifest';
import { buildSitemap } from './sitemap';
import ShowcaseApp from './ShowcaseApp.vue';
import { entries } from './registry';
import { mergeRegistry } from './registry/merge';

export const render = (): Promise<string> => renderToString(createSSRApp(ShowcaseApp));

export const artifacts = (version: string, lastmod: string) => {
  const manifest = buildManifest(mergeRegistry(entries, extracted), version);
  return { manifest, llmsTxt: buildLlmsTxt(manifest), sitemap: buildSitemap(lastmod) };
};
