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
