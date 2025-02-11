export type ExtraLibrariesOption = 'unocss' | 'formatter';

export interface PromItem<T> {
  value: T;
  label: string;
  hint?: string;
}

export type FrameworkOption = 'vue' | 'react' | 'astro' | 'solid' | 'svelte' | 'slidev';

export interface PromptResult {
  updateJetbrainsIdea: unknown;
  uncommittedConfirmed: boolean;
  frameworks: FrameworkOption[];
  extra: ExtraLibrariesOption[];
  updateVscodeSettings: unknown;
}

export interface JetbrainsProjectSettings {
  '?xml': {
    version: string;
    encoding: string;
  };
  'project': {
    version: string;
    component: {
      'name': string;
      [p: string]: any;
      'files-pattern'?: { value: string };
      'extra-options'?: { value: string };
      'work-dir-patterns'?: { value: string };
      'additional-rules-dir'?: { value: string };
      'option'?: { name: string; value: string };
      'custom-configuration-file'?: { path: string; used: 'true' | 'false' };
    };
  };
}
