import { I9kButtonEntry } from './I9kButton';
import { I9kClusterEntry } from './I9kCluster';
import { I9kGridEntry } from './I9kGrid';
import { I9kInputEntry } from './I9kInput';
import { I9kNavigationEntry } from './I9kNavigation';
import { I9kPageContainerEntry } from './I9kPageContainer';
import { I9kPanelEntry } from './I9kPanel';
import type { ShowcaseEntry } from './types';

export const entries: ShowcaseEntry[] = [
  I9kGridEntry,
  I9kPageContainerEntry,
  I9kClusterEntry,
  I9kPanelEntry,
  I9kInputEntry,
  I9kButtonEntry,
  I9kNavigationEntry,
];
