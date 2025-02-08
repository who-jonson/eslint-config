import yargs from 'yargs';
import c from 'picocolors';
import process from 'node:process';
import * as p from '@clack/prompts';
import { hideBin } from 'yargs/helpers';

import { run } from './run';
import { pkgJson } from './constants';

function header(): void {
  console.log('\n');
  p.intro(`${c.green('@whoj/eslint-config ')}${c.dim(`v${pkgJson.version}`)}`);
}

const instance = yargs(hideBin(process.argv))
  .scriptName('@whoj/eslint-config')
  .usage('')
  .command(
    '*',
    'Run the initialization or migration',
    args => args
      .option('yes', {
        alias: 'y',
        type: 'boolean',
        description: 'Skip prompts and use default values'
      })
      .option('template', {
        alias: 't',
        type: 'string',
        description: 'Use the framework template for optimal customization: vue / react / svelte / astro'
      })
      .option('extra', {
        alias: 'e',
        array: true,
        type: 'string',
        description: 'Use the extra utils: formatter / perfectionist / unocss'
      })
      .help(),
    async (args) => {
      header();
      try {
        await run(args);
      }
      catch (error) {
        p.log.error(c.inverse(c.red(' Failed to migrate ')));
        p.log.error(c.red(`✘ ${String(error)}`));
        process.exit(1);
      }
    }
  )
  .showHelpOnFail(false)
  .alias('h', 'help')
  .version('version', pkgJson.version)
  .alias('v', 'version');

// eslint-disable-next-line ts/no-unused-expressions
instance
  .help()
  .argv;
