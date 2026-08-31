import type { ExtractedEmit, ExtractedProp } from './extract/types';
import { RULES } from './registry/rules';
import type { ShowcaseComponent } from './registry/types';

export interface ManifestComponent {
  name: string;
  section: string;
  summary: string;
  props: ExtractedProp[];
  emits: ExtractedEmit[];
  slots: string[];
  referencedTypes: Record<string, string>;
  gotchas: string[];
  prompt: string;
}

export interface Manifest {
  package: string;
  version: string;
  styleImport: string;
  rules: string[];
  components: ManifestComponent[];
}

export const buildManifest = (components: ShowcaseComponent[], version: string): Manifest => ({
  package: '@9klabs/design',
  version,
  styleImport: '@9klabs/design/style.css',
  rules: RULES,
  components: components.map((component) => ({
    name: component.name,
    section: component.section,
    summary: component.summary,
    props: component.props,
    emits: component.emits,
    slots: component.slots,
    referencedTypes: component.referencedTypes,
    gotchas: component.gotchas,
    prompt: component.agentPrompt,
  })),
});

export const buildLlmsTxt = (manifest: Manifest): string => {
  const lines = [
    `# ${manifest.package}`,
    '',
    `Vue 3 design system, version ${manifest.version}.`,
    `Import the stylesheet once at your app entry: ${manifest.styleImport}`,
    '',
    'Full machine-readable reference: /components.json',
    '',
    '## Rules',
    '',
    ...manifest.rules.map((rule) => `- ${rule}`),
    '',
    '## Components',
    '',
  ];

  for (const component of manifest.components) {
    lines.push(`### ${component.name}`, '', component.summary, '', component.prompt, '');
  }

  return lines.join('\n');
};
