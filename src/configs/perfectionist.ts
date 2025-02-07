import type { TypedFlatConfigItem } from '../types';

import { pluginPerfectionist } from '../plugins';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(): TypedFlatConfigItem[] {
  return [
    {
      name: 'whoj/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist
      },
      rules: {
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'line-length' }],
        'perfectionist/sort-imports': ['error', {
          newlinesBetween: 'always',
          // groups: [
          //   'type',
          //   ['parent-type', 'sibling-type', 'index-type', 'internal-type'],
          //
          //   'builtin',
          //   'external',
          //
          //   'internal',
          //   ['parent', 'sibling', 'index'],
          //
          //   'side-effect',
          //   'object',
          //   'unknown'
          // ],
          order: 'asc',
          type: 'line-length'
        }],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'line-length' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'line-length' }]
      }
    }
  ];
}
