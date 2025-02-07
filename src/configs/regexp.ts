import { configs } from 'eslint-plugin-regexp';

import type { OptionsRegExp, OptionsOverrides, TypedFlatConfigItem } from '../types';

export async function regexp(
  options: OptionsRegExp & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const config = configs['flat/recommended'] as TypedFlatConfigItem;

  const rules = {
    ...config.rules
  };

  if (options.level === 'warn') {
    for (const key in rules) {
      if (rules[key] === 'error')
        rules[key] = 'warn';
    }
  }

  return [
    {
      ...config,
      name: 'whoj/regexp/rules',
      rules: {
        ...rules,
        ...options.overrides
      }
    }
  ];
}
