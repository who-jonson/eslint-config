import type { TypedFlatConfigItem } from '../types';

import { pluginNode } from '../plugins';

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'whoj/node/rules',
      plugins: {
        node: pluginNode
      },
      rules: {
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/prefer-global/buffer': ['off'],
        'node/prefer-global/process': ['off'],
        'node/process-exit-as-throw': 'error',
        'node/handle-callback-err': ['error', '^(err|error)$']
      }
    }
  ];
}
