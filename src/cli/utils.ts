import { execSync } from 'node:child_process';

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

export function getJetbrainsEslintConfigContent(configFrom: string): string {
  return `
import whoj from "${configFrom}";

export default whoj.clone().overrides({
  'whoj/javascript/rules': {
    rules: {
      'prefer-const': 'warn',
        'unused-imports/no-unused-imports': 'warn'
    }
  },
  'whoj/test/rules': {
    rules: {
      'test/no-only-tests': 'warn',
      'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
    }
  }
}).disableRulesFix([
  'unused-imports/no-unused-imports',
  'test/no-only-tests',
  'prefer-const'
], {
  builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules)
});
`.trimStart();
}

export function isGitClean(): boolean {
  try {
    execSync('git diff-index --quiet HEAD --');
    return true;
  }
  catch {
    return false;
  }
}
