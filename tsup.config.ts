import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: [
    'src/index.ts',
    'src/cli.ts'
  ],
  format: ['esm'],
  noExternal: [
    '@antfu/utils'
  ],
  platform: 'node',
  shims: true,
  skipNodeModulesBundle: true
});
