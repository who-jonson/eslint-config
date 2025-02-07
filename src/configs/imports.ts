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
        import: pluginImport,
        whoj: pluginAntfu
      },
      rules: {
        'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',

        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'whoj/import-dedupe': 'error',
        'whoj/no-import-dist': 'error',
        'whoj/no-import-node-modules-by-path': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }]
            }
          : {}
      }
    }
  ];
}
