import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

import type { OptionsNuxt, TypedFlatConfigItem } from '../types';

export function nuxt({ dirs, features = {} }: OptionsNuxt<'standalone'> = {}): Promise<TypedFlatConfigItem[]> {
  return createConfigForNuxt({
    dirs,
    features: {
      ...features,
      standalone: false
    }
  })
    .append({
      rules: {},
      name: 'whoj/nuxt/rules'
    })
    .toConfigs();
}
