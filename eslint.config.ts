// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate';

import { whoj } from './src';

export default whoj(
  {
    astro: false,
    formatters: true,
    react: false,
    solid: false,
    svelte: false,
    type: 'lib',
    typescript: true,
    vue: true
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
      'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'line-length' }],
      'perfectionist/sort-objects': ['error', { order: 'asc', type: 'line-length' }]
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
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
);
