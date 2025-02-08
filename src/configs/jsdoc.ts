import type { OptionsStylistic, TypedFlatConfigItem } from '../types';

import { interopDefault } from '../utils';

export async function jsdoc(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true
  } = options;

  return [
    {
      name: 'whoj/jsdoc/rules',
      plugins: {
        jsdoc: await interopDefault(import('eslint-plugin-jsdoc'))
      },
      rules: {
        'jsdoc/empty-tags': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/check-access': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/require-yields-check': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-property-description': 'warn',
        ...stylistic
          ? {
              'jsdoc/check-alignment': 'warn',
              'jsdoc/multiline-blocks': 'warn'
            }
          : {}
      }
    }
  ];
}
