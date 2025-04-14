export interface AutocompleteValueOption {
  value: string;
  label: string;
  caption?: string;
}

export interface ConditionalOption {
  match: (current: string, previous: string) => boolean;
  options: AutocompleteValueOption[];
}
