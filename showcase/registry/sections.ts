import type { SectionId } from './types';

export const SECTIONS: { id: SectionId; title: string }[] = [
  { id: 'install', title: 'Install' },
  { id: 'tokens', title: 'Tokens' },
  { id: 'layout', title: 'Layout & surfaces' },
  { id: 'content', title: 'Content' },
  { id: 'forms', title: 'Forms' },
  { id: 'actions', title: 'Actions' },
  { id: 'feedback', title: 'Feedback' },
  { id: 'chrome', title: 'Site chrome' },
  { id: 'rules', title: 'Rules for agents' },
];
