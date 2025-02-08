import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  shims: true,
  format: ['esm'],
  platform: 'node',
  skipNodeModulesBundle: true,
  external: [
    /^(?!(\/|\.\/|\.\.\/))/
  ],
  entry: [
    'src/index.ts',
    'src/cli.ts'
  ]
});
