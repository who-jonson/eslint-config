import type { StylisticConfig, OptionsOverrides, TypedFlatConfigItem } from '../types';

import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  semi: true,
  quotes: 'single',
  commaDangle: 'never'
};

export interface StylisticOptions extends OptionsOverrides, StylisticConfig {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    jsx,
    semi,
    indent,
    quotes,
    commaDangle,
    overrides = {},
    lessOpinionated = false
  } = {
    ...StylisticConfigDefaults,
    ...options
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
  // pluginStylistic.configs.custo
  const config = pluginStylistic.configs.customize({
    jsx,
    semi,
    indent,
    quotes,
    flat: true,
    commaDangle,
    pluginName: 'style'
  });

  return [
    {
      name: 'whoj/stylistic/rules',
      plugins: {
        whoj: pluginAntfu,
        style: pluginStylistic
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
