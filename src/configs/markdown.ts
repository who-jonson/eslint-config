import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem, OptionsComponentExts } from '../types';

import { parserPlain, interopDefault } from '../utils';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';

export async function markdown(
  options: OptionsFiles & OptionsOverrides & OptionsComponentExts = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    componentExts = [],
    files = [GLOB_MARKDOWN]
  } = options;

  const markdown = await interopDefault(import('@eslint/markdown'));

  return [
    {
      name: 'whoj/markdown/setup',
      plugins: {
        markdown
      }
    },
    {
      files,
      name: 'whoj/markdown/processor',
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors!.markdown,
        processorPassThrough
      ])
    },
    {
      files,
      name: 'whoj/markdown/parser',
      languageOptions: {
        parser: parserPlain
      }
    },
    {
      name: 'whoj/markdown/disables',
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`)
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true
          }
        }
      },
      rules: {
        'no-alert': 'off',

        'no-undef': 'off',

        'no-labels': 'off',
        'no-console': 'off',
        'unicode-bom': 'off',
        'no-lone-blocks': 'off',
        'no-unused-vars': 'off',
        'style/eol-last': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',

        'no-unused-labels': 'off',
        'ts/no-unused-vars': 'off',
        'style/comma-dangle': 'off',

        'no-restricted-syntax': 'off',
        'no-unused-expressions': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-use-before-define': 'off',
        'whoj/no-top-level-await': 'off',
        'ts/no-unused-expressions': 'off',
        'node/prefer-global/process': 'off',
        'ts/consistent-type-imports': 'off',
        'import/newline-after-import': 'off',

        'unused-imports/no-unused-vars': 'off',
        'ts/explicit-function-return-type': 'off',
        'unused-imports/no-unused-imports': 'off',

        ...overrides
      }
    }
  ];
}
