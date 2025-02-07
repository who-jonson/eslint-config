// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate';

import { whoj } from './src';

export default whoj(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
    type: 'lib'
  },
  {
    ignores: [
      'fixtures',
      '_fixtures'
    ]
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error'
    }
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }]
    }
  },
  {
    rules: {
      'eqeqeq': 'warn',
      'style/semi': [2, 'always'],
      'import/order': 'off',
      'require-await': 'warn',
      'no-useless-escape': 'off',
      'style/quotes': ['error', 'single'],
      'style/comma-dangle': ['error', 'never'],
      'style/spaced-comment': 'off',
      'node/prefer-global/buffer': ['off'],
      'node/prefer-global/process': ['off'],

      'jsdoc/require-returns-check': ['off'],
      'jsdoc/require-returns-description': ['off'],

      'perfectionist/sort-imports': ['off'],
      'perfectionist/sort-exports': ['error', { type: 'line-length' }],
      'perfectionist/sort-named-exports': ['error', { type: 'line-length' }],
      'perfectionist/sort-named-imports': ['error', { type: 'line-length' }],

      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
);
