import fs from 'node:fs/promises';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

import { jsx, vue, node, nuxt, test, toml, yaml, astro, jsdoc, jsonc, react, solid, regexp, svelte, unocss, combine, imports, unicorn, comments, markdown, stylistic, formatters, javascript, typescript, perfectionist, sortPackageJson } from '../src';

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries())
      }
    }
  },
  astro(),
  comments(),
  formatters(),
  imports(),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  nuxt(),
  perfectionist(),
  react(),
  solid(),
  sortPackageJson(),
  stylistic(),
  svelte(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
  yaml()
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`;

await fs.writeFile('src/typegen.d.ts', dts);
