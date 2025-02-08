export type ExtraLibrariesOption = 'unocss' | 'formatter';

export interface PromItem<T> {
  value: T;
  label: string;
  hint?: string;
}

export type FrameworkOption = 'vue' | 'react' | 'astro' | 'solid' | 'svelte' | 'slidev';

export interface PromptResult {
  uncommittedConfirmed: boolean;
  frameworks: FrameworkOption[];
  extra: ExtraLibrariesOption[];
  updateVscodeSettings: unknown;
}
