import type { TypedFlatConfigItem } from '../types';

import { pluginPerfectionist } from '../plugins';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(): TypedFlatConfigItem[] {
  const { name, rules, ...config } = pluginPerfectionist.configs['recommended-line-length'];

  return [
    {
      ...config,
      name: 'whoj/perfectionist/setup',
      rules: { // @ts-ignore
        ...Object.entries(rules!).reduce((_rules, [rule, [severity, options]]) => {
          _rules[rule] = [severity, { ...options, order: 'asc' }];
          return _rules;
        }, {} as Exclude<typeof rules, undefined>)
        // 'perfectionist/sort-exports': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-objects': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'line-length' }],
        // 'perfectionist/sort-intersection-types': ['error', { order: 'asc', type: 'alphabetical' }],
        // 'perfectionist/sort-imports': ['error', {
        //   order: 'asc',
        //   type: 'line-length',
        //   newlinesBetween: 'ignore',
        //   groups: [
        //     ['type', 'parent-type', 'sibling-type', 'index-type', 'internal-type'],
        //
        //     ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        //
        //     'side-effect',
        //     'object',
        //     'unknown'
        //   ]
        // }]
      }
    }
  ];
}
