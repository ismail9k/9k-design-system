export interface ExtractedProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
}

export interface ExtractedEmit {
  name: string;
  payload: string;
}

export interface ExtractedComponent {
  name: string;
  props: ExtractedProp[];
  emits: ExtractedEmit[];
  slots: string[];
  referencedTypes: Record<string, string>;
}

export interface ColorValue {
  /** The declaration exactly as authored in tokens.css. */
  value: string;
  /** The same color normalized to space-separated `hsl()`. */
  hsl: string;
  /** Uppercase `#RRGGBB`, or `#RRGGBBAA` when the token carries an alpha channel. */
  hex: string;
}

export interface BrandColorToken extends ColorValue {
  name: string;
}

export interface ThemeColorToken {
  name: string;
  light: ColorValue | null;
  dark: ColorValue | null;
}

export interface ColorTokens {
  brand: BrandColorToken[];
  theme: ThemeColorToken[];
}
