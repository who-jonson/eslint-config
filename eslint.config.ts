// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate';

import { whoj } from './src';

export default whoj(
  {
    vue: true,
    type: 'lib',
    react: false,
    solid: false,
    astro: false,
    svelte: false,
    typescript: true,
    formatters: true
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
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
);
