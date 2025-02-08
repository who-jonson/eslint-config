import type { TypedFlatConfigItem } from '../types';

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs';

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'whoj/disables/scripts',
      files: [`**/scripts/${GLOB_SRC}`],
      rules: {
        'no-console': 'off',
        'whoj/no-top-level-await': 'off',
        'ts/explicit-function-return-type': 'off'
      }
    },
    {
      name: 'whoj/disables/cli',
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
        'whoj/no-top-level-await': 'off'
      }
    },
    {
      name: 'whoj/disables/bin',
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      rules: {
        'whoj/no-import-dist': 'off',
        'whoj/no-import-node-modules-by-path': 'off'
      }
    },
    {
      name: 'whoj/disables/dts',
      files: ['**/*.d.?([cm])ts'],
      rules: {
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
        'eslint-comments/no-unlimited-disable': 'off'
      }
    },
    {
      name: 'whoj/disables/cjs',
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off'
      }
    },
    {
      name: 'whoj/disables/config-files',
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
        'whoj/no-top-level-await': 'off',
        'ts/explicit-function-return-type': 'off'
      }
    }
  ];
}
