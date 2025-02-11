import fs from 'node:fs';
import c from 'picocolors';
import path from 'node:path';
import fsp from 'node:fs/promises';
import process from 'node:process';
import * as p from '@clack/prompts';
import { deepMergeWithArray } from '@antfu/utils';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

import type { PromptResult } from '../types';

import { jetbrainsSettingsObj } from '../constants';
import { getJetbrainsEslintConfigContent } from '../utils';

export async function updateJetbrainsIdea(result: PromptResult, flatConfigPath: string): Promise<void> {
  const cwd = process.cwd();

  if (!result.updateJetbrainsIdea)
    return;

  const dotIdeaPath: string = path.join(cwd, '.idea/jsLinters');
  const settingsPath: string = path.join(dotIdeaPath, 'eslint.xml');
  const ideaFlatConfigPath: string = path.join(dotIdeaPath, path.basename(flatConfigPath));

  const xmlParserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    unpairedTags: [
      'option',
      'files-pattern',
      'extra-options',
      'work-dir-patterns',
      'additional-rules-dir',
      'custom-configuration-file'
    ]
  };

  const xmlBuilderOptions = {
    format: true,
    ...xmlParserOptions,
    suppressUnpairedNode: false,
    suppressBooleanAttributes: false
  };

  const builder = new XMLBuilder(xmlBuilderOptions);

  if (!fs.existsSync(dotIdeaPath)) {
    await fsp.mkdir(dotIdeaPath, { recursive: true });
  }

  await fsp.writeFile(
    ideaFlatConfigPath,
    getJetbrainsEslintConfigContent(flatConfigPath),
    'utf8'
  );
  p.log.success(c.green(`Created ${path.relative(cwd, ideaFlatConfigPath)}`));

  const ideaSettingsObject = deepMergeWithArray(
    jetbrainsSettingsObj,
    {
      project: {
        component: {
          'custom-configuration-file': {
            used: 'true',
            path: `$PROJECT_DIR$/.idea/jsLinters/${path.basename(flatConfigPath)}`
          }
        }
      }
    }
  );

  if (!fs.existsSync(settingsPath)) {
    await fsp.writeFile(settingsPath, builder.build(ideaSettingsObject), 'utf8');
    p.log.success(c.green('Created .idea/jsLinters/eslint.xml'));
  }
  else {
    const ideaSettingsContent = await fsp.readFile(settingsPath, 'utf8');

    const parser = new XMLParser(xmlParserOptions);
    const ideaXml = deepMergeWithArray(
      parser.parse(ideaSettingsContent),
      jetbrainsSettingsObj
    );

    await fsp.writeFile(settingsPath, builder.build(ideaXml), 'utf8');
    p.log.success(c.green('Updated .idea/jsLinters/eslint.xml'));
  }
}
