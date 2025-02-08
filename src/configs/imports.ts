import type { OptionsStylistic, TypedFlatConfigItem } from '../types';

import { pluginAntfu, pluginImport } from '../plugins';

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true
  } = options;

  return [
    {
      name: 'whoj/imports/rules',
      plugins: {
        whoj: pluginAntfu,
        import: pluginImport
      },
      rules: {
        'import/first': 'error',
        'whoj/import-dedupe': 'error',
        'whoj/no-import-dist': 'error',

        'import/no-duplicates': 'error',
        'import/no-self-import': 'error',
        'import/no-named-default': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'whoj/no-import-node-modules-by-path': 'error',
        'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }]
            }
          : {}
      }
    }
  ];
}
