import type { TypedFlatConfigItem } from '../types';

import { GLOB_EXCLUDE } from '../globs';

export async function ignores(userIgnores: string[] = []): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'whoj/ignores',
      ignores: [
        ...GLOB_EXCLUDE,
        ...userIgnores
      ]
    }
  ];
}
