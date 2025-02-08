import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';

import { pluginUnicorn } from '../plugins';

export async function unicorn(options: OptionsUnicorn = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'whoj/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn
      },
      rules: {
        ...(options.allRecommended
          ? pluginUnicorn.configs['flat/recommended'].rules
          : {
              'unicorn/escape-case': 'error',
              'unicorn/no-new-array': 'error',
              'unicorn/error-message': 'error',
              'unicorn/no-new-buffer': 'error',
              'unicorn/prefer-includes': 'error',
              'unicorn/throw-new-error': 'error',
              'unicorn/new-for-builtins': 'error',
              'unicorn/prefer-type-error': 'error',
              'unicorn/no-instanceof-array': 'error',
              'unicorn/number-literal-case': 'error',
              'unicorn/prefer-node-protocol': 'error',
              'unicorn/prefer-number-properties': 'error',
              'unicorn/prefer-dom-node-text-content': 'error',
              'unicorn/consistent-empty-array-spread': 'error',
              'unicorn/prefer-string-starts-ends-with': 'error'
            })
      }
    }
  ];
}
