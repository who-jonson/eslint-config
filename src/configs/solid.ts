import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem, OptionsHasTypeScript, OptionsTypeScriptWithTypes } from '../types';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import { toArray, ensurePackages, interopDefault } from '../utils';

export async function solid(
  options: OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsTypeScriptWithTypes = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    typescript = true,
    files = [GLOB_JSX, GLOB_TSX]
  } = options;

  await ensurePackages([
    'eslint-plugin-solid'
  ]);

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined;
  const isTypeAware = !!tsconfigPath;

  const [
    pluginSolid,
    parserTs
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-solid')),
    interopDefault(import('@typescript-eslint/parser'))
  ] as const);

  return [
    {
      name: 'whoj/solid/setup',
      plugins: {
        solid: pluginSolid
      }
    },
    {
      files,
      name: 'whoj/solid/rules',
      languageOptions: {
        parser: parserTs,
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ...isTypeAware ? { project: tsconfigPath } : {}
        }
      },
      rules: {
        // these rules are mostly style suggestions
        'solid/imports': 'error',
        'solid/reactivity': 'warn',
        'solid/prefer-for': 'error',
        'solid/jsx-no-undef': 'error',
        'solid/jsx-uses-vars': 'error',
        'solid/no-react-deps': 'error',
        'solid/no-destructure': 'error',
        'solid/jsx-no-script-url': 'error',
        'solid/self-closing-comp': 'error',
        // reactivity
        'solid/components-return-once': 'warn',
        'solid/no-unknown-namespaces': 'error',
        // identifier usage is important
        'solid/jsx-no-duplicate-props': 'error',
        'solid/no-react-specific-props': 'error',
        // security problems
        'solid/no-innerhtml': ['error', { allowStatic: true }],
        'solid/style-prop': ['error', { styleProps: ['style', 'css'] }],
        'solid/event-handlers': ['error', {
          // if true, don't warn on ambiguously named event handlers like `onclick` or `onchange`
          ignoreCase: false,
          // if true, warn when spreading event handlers onto JSX. Enable for Solid < v1.6.
          warnOnSpread: false
        }],
        ...typescript
          ? {
              'solid/no-unknown-namespaces': 'off',
              'solid/jsx-no-undef': ['error', { typescriptEnabled: true }]
            }
          : {},
        // overrides
        ...overrides
      }
    }
  ];
}
