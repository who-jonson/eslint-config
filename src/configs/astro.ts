import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types';

import { GLOB_ASTRO } from '../globs';
import { interopDefault } from '../utils';

export async function astro(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_ASTRO]
  } = options;

  const [
    pluginAstro,
    parserAstro,
    parserTs
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
    interopDefault(import('@typescript-eslint/parser'))
  ] as const);

  return [
    {
      name: 'whoj/astro/setup',
      plugins: {
        astro: pluginAstro
      }
    },
    {
      files,
      name: 'whoj/astro/rules',
      processor: 'astro/client-side-ts',
      languageOptions: {
        parser: parserAstro,
        sourceType: 'module',
        globals: pluginAstro.environments.astro.globals,
        parserOptions: {
          parser: parserTs,
          extraFileExtensions: ['.astro']
        }
      },
      rules: {
        'astro/semi': 'off',

        'astro/valid-compile': 'error',
        // Astro uses top level await for e.g. data fetching
        // https://docs.astro.build/en/guides/data-fetching/#fetch-in-astro
        'whoj/no-top-level-await': 'off',
        'astro/no-set-html-directive': 'off',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        // use recommended rules
        'astro/missing-client-only-directive-value': 'error',

        ...stylistic
          ? {
              'style/indent': 'off',
              'style/no-multiple-empty-lines': 'off',
              'style/jsx-closing-tag-location': 'off',
              'style/jsx-one-expression-per-line': 'off'
            }
          : {},

        ...overrides
      }
    }
  ];
}
