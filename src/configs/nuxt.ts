import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

import type { OptionsNuxt, TypedFlatConfigItem } from '../types';

export function nuxt({ dirs, features = {} }: OptionsNuxt = {}): Promise<TypedFlatConfigItem[]> {
  return createConfigForNuxt({
    dirs,
    features: {
      ...features,
      standalone: false
    }
  })
    .append({
      name: 'whoj/nuxt/rules',
      rules: {}
    })
    .toConfigs();
}
