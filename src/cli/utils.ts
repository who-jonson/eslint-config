import { execSync } from 'node:child_process';

export function isGitClean(): boolean {
  try {
    execSync('git diff-index --quiet HEAD --');
    return true;
  }
  catch {
    return false;
  }
}

export function getJetbrainsEslintConfigContent(configFrom: string): string {
  return `
import { whoj } from '@whoj/eslint-config';
import _defaults from "${configFrom}";

export default whoj({
  isInEditor: true
}).append(_defaults);
`.trimStart();
}

export function getEslintConfigContent(
  mainConfig: string,
  additionalConfigs?: string[]
): string {
  return `
import whoj from '@whoj/eslint-config';

export default whoj({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)});
`.trimStart();
}
