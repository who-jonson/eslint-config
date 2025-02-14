import type { Linter } from 'eslint';

import type { TypedFlatConfigItem } from '../types';

import { pluginPerfectionist } from '../plugins';

const LINE_LENGTH_REGEX = /.*(?<!classes|heritage-clauses|intersection-types|interfaces|modules|objects)$/;

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
        ...getRules({ order: 'asc', type: 'natural' }),
        ...getRules({ order: 'asc', type: 'line-length' })
      }
    }
  ];
}

function getRules(
  options: {
    order: 'asc' | 'desc';
    type: 'natural' | 'line-length';
  }
): Linter.RulesRecord {
  return Object.fromEntries(
    Object.keys({ ...pluginPerfectionist.rules! }).filter(
      ruleName => options.type === 'natural'
        ? !LINE_LENGTH_REGEX.test(ruleName) && !ruleName.endsWith('sort-modules')
        : LINE_LENGTH_REGEX.test(ruleName)
    )
      .map(
        ruleName => [
          `${pluginPerfectionist.name}/${ruleName}`,
          ['error', options]
        ]
      )
  );
}
