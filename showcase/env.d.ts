declare module 'virtual:showcase-data' {
  import type { ColorTokens, ExtractedComponent } from './extract/types';

  export const extracted: ExtractedComponent[];
  export const colorTokens: ColorTokens;
}
