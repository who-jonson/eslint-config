import type { OptionsFiles, OptionsOverrides, OptionsIsInEditor, TypedFlatConfigItem } from '../types';

import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any;

export async function test(
  options: OptionsFiles & OptionsOverrides & OptionsIsInEditor = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    files = GLOB_TESTS,
    isInEditor = false
  } = options;

  const [
    pluginVitest,
    pluginNoOnlyTests
  ] = await Promise.all([
    interopDefault(import('@vitest/eslint-plugin')),
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-no-only-tests'))
  ] as const);

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules
    }
  };

  return [
    {
      name: 'whoj/test/setup',
      plugins: {
        test: _pluginTest
      }
    },
    {
      files,
      name: 'whoj/test/rules',
      rules: {
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        'test/no-only-tests': isInEditor ? 'warn' : 'error',
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],

        // Disables
        ...{
          'no-unused-expressions': 'off',
          'whoj/no-top-level-await': 'off',
          'node/prefer-global/process': 'off',
          'ts/explicit-function-return-type': 'off'
        },

        ...overrides
      }
    }
  ];
}
