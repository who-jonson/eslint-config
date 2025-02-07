import type { StylisticConfig, OptionsOverrides, TypedFlatConfigItem } from '../types';

import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  commaDangle: 'never',
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    commaDangle,
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi
  } = {
    ...StylisticConfigDefaults,
    ...options
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
  // pluginStylistic.configs.custo
  const config = pluginStylistic.configs.customize({
    commaDangle,
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi
  });

  return [
    {
      name: 'whoj/stylistic/rules',
      plugins: {
        style: pluginStylistic,
        whoj: pluginAntfu
      },
      rules: {
        ...config.rules,

        'whoj/consistent-chaining': 'error',
        'whoj/consistent-list-newline': 'error',

        ...(lessOpinionated
          ? {
              curly: ['error', 'all']
            }
          : {
              'whoj/curly': 'error',
              'whoj/if-newline': 'error',
              'whoj/top-level-function': 'error'
            }
        ),

        ...overrides
      }
    }
  ];
}
