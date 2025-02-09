import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  shims: true,
  format: ['esm'],
  platform: 'node',
  skipNodeModulesBundle: true,
  noExternal: [
    '@antfu/utils'
  ],
  entry: [
    'src/index.ts',
    'src/cli.ts'
  ]
});
