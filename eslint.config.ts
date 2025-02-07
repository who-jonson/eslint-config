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
      'require-await': 'off',

      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
);
