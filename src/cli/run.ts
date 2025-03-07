/* eslint-disable perfectionist/sort-objects */
import fs from 'node:fs';
import c from 'picocolors';
import path from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';

import type { PromptResult, FrameworkOption, ExtraLibrariesOption } from './types';

import { isGitClean } from './utils';
import { updateEslintFiles } from './stages/update-eslint-files';
import { updatePackageJson } from './stages/update-package-json';
import { updateJetbrainsIdea } from './stages/update-jetbrains-idea';
import { updateVscodeSettings } from './stages/update-vscode-settings';
import { extra, frameworks, extraOptions, frameworkOptions } from './constants';

export interface CliRunOptions {
  /**
   * Skip prompts and use default values
   */
  yes?: boolean;

  /**
   * Add/Update .vscode/settings.json for better VS Code experience.
   */
  vscode?: boolean;

  /**
   * Configure eslint settings for better Jetbrains IDE. (WebStorm / PhpStorm) experience.
   */
  jetbrains?: boolean;

  /**
   * Use the extra utils: 'formatter' | 'perfectionist' | 'unocss'
   */
  extra?: Array<ExtraLibrariesOption>;

  /**
   * Use the framework template for optimal customization: vue / react / svelte / astro
   */
  frameworks?: Array<FrameworkOption>;
}

export async function run({ jetbrains, vscode, ...options }: CliRunOptions = {}): Promise<void> {
  const argSkipPrompt = !!process.env.SKIP_PROMPT || options.yes;
  const argTemplate = <FrameworkOption[]>options.frameworks?.map(m => m.trim());
  const argExtra = <ExtraLibrariesOption[]>options.extra?.map(m => m.trim());

  if (fs.existsSync(path.join(process.cwd(), 'eslint.config.js'))) {
    p.log.warn(c.yellow('eslint.config.js already exists, migration wizard exited.'));
    return process.exit(1);
  }

  // Set default value for promptResult if `argSkipPrompt` is enabled
  let result: PromptResult = {
    extra: argExtra ?? [],
    frameworks: argTemplate ?? [],
    uncommittedConfirmed: false,
    updateVscodeSettings: vscode ?? true,
    updateJetbrainsIdea: jetbrains ?? true
  };

  if (!argSkipPrompt) {
    result = await p.group({
      uncommittedConfirmed: () => {
        if (argSkipPrompt || isGitClean())
          return Promise.resolve(true);

        return p.confirm({
          initialValue: false,
          message: 'There are uncommitted changes in the current repository, are you sure to continue?'
        });
      },
      frameworks: ({ results }) => {
        const isArgTemplateValid = typeof argTemplate === 'string' && !!frameworks.includes(<FrameworkOption>argTemplate);

        if (!results.uncommittedConfirmed || isArgTemplateValid)
          return;

        const message = !isArgTemplateValid && argTemplate
          ? `"${argTemplate}" isn't a valid template. Please choose from below: `
          : 'Select a framework:';

        return p.multiselect<FrameworkOption>({
          message: c.reset(message),
          options: frameworkOptions,
          required: false
        });
      },
      extra: ({ results }) => {
        const isArgExtraValid = argExtra?.length && !argExtra.filter(element => !extra.includes(<ExtraLibrariesOption>element)).length;

        if (!results.uncommittedConfirmed || isArgExtraValid)
          return;

        const message = !isArgExtraValid && argExtra
          ? `"${argExtra}" isn't a valid extra util. Please choose from below: `
          : 'Select a extra utils:';

        return p.multiselect<ExtraLibrariesOption>({
          message: c.reset(message),
          options: extraOptions,
          required: false
        });
      },

      updateJetbrainsIdea: ({ results }) => {
        if (!results.uncommittedConfirmed)
          return;

        return p.confirm({
          initialValue: true,
          message: 'Update JetBrain IDE\'s eslint configuration for better experience WebStorm / PhpStorm?'
        });
      },
      updateVscodeSettings: ({ results }) => {
        if (!results.uncommittedConfirmed)
          return;

        return p.confirm({
          initialValue: true,
          message: 'Update .vscode/settings.json for better VS Code experience?'
        });
      }
    }, {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      }
    }) as PromptResult;

    if (!result.uncommittedConfirmed)
      return process.exit(1);
  }

  await updatePackageJson(result);
  const configFileName = await updateEslintFiles(result);
  await updateJetbrainsIdea(
    result,
    configFileName
  );
  await updateVscodeSettings(result);

  p.log.success(c.green('Setup completed'));
  p.outro(`Now you can update the dependencies by run ${c.blue('pnpm install')} and run ${c.blue('eslint . --fix')}\n`);
}
