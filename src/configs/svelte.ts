import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem, OptionsHasTypeScript } from '../types';

import { GLOB_SVELTE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function svelte(
  options: OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsStylistic = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_SVELTE]
  } = options;

  const {
    indent = 2,
    quotes = 'single'
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  await ensurePackages([
    'eslint-plugin-svelte'
  ]);

  const [
    pluginSvelte,
    parserSvelte
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-svelte')),
    interopDefault(import('svelte-eslint-parser'))
  ] as const);

  return [
    {
      name: 'whoj/svelte/setup',
      plugins: {
        svelte: pluginSvelte
      }
    },
    {
      files,
      name: 'whoj/svelte/rules',
      processor: pluginSvelte.processors['.svelte'],
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null
        }
      },
      rules: {
        'no-undef': 'off', // incompatible with most recent (attribute-form) generic types RFC
        'svelte/system': 'error',
        'svelte/valid-each-key': 'error',

        'svelte/no-at-debug-tags': 'warn',
        'svelte/no-at-html-tags': 'error',
        'import/no-mutable-exports': 'off',
        'svelte/comment-directive': 'error',
        'svelte/no-dynamic-slot-name': 'error',
        'svelte/no-reactive-literals': 'error',
        'svelte/no-useless-mustaches': 'error',
        'svelte/no-inner-declarations': 'error',
        'svelte/no-reactive-functions': 'error',
        'svelte/no-dupe-else-if-blocks': 'error',
        'svelte/no-dupe-use-directives': 'error',
        'svelte/no-not-function-handler': 'error',
        'svelte/no-unused-svelte-ignore': 'error',
        'svelte/no-dupe-style-properties': 'error',
        'svelte/no-object-in-text-mustaches': 'error',
        'svelte/no-unknown-style-directive-property': 'error',
        'svelte/no-shorthand-style-property-overrides': 'error',
        'svelte/require-store-callbacks-use-set-param': 'error',
        'svelte/no-export-load-in-svelte-module-in-kit-pages': 'error',
        'no-unused-vars': ['error', {
          vars: 'all',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^(\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)'
        }],

        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^(_|\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)'
          }
        ],

        ...stylistic
          ? {
              'style/indent': 'off', // superseded by svelte/indent
              'style/no-trailing-spaces': 'off', // superseded by svelte/no-trailing-spaces
              'svelte/mustache-spacing': 'error',
              'svelte/no-trailing-spaces': 'error',
              'svelte/spaced-html-comment': 'error',
              'svelte/html-closing-bracket-spacing': 'error',
              'svelte/derived-has-same-inputs-outputs': 'error',
              'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
              'svelte/indent': ['error', { indent, alignAttributesVertically: true }],
              'svelte/html-quotes': ['error', { prefer: quotes === 'backtick' ? 'double' : quotes }]
            }
          : {},

        ...overrides
      }
    }
  ];
}
