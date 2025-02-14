import type { Linter } from 'eslint';

import { isPackageExists } from 'local-pkg';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

import type { RuleOptions } from './typegen';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types';

import { regexp } from './configs/regexp';
import { formatters } from './configs/formatters';
import { isInEditorEnv, interopDefault } from './utils';
import {
  jsx,
  vue,
  node,
  test,
  toml,
  yaml,
  astro,
  jsdoc,
  jsonc,
  react,
  solid,
  svelte,
  unocss,
  command,
  ignores,
  imports,
  unicorn,
  comments,
  disables,
  markdown,
  stylistic,
  javascript,
  typescript,
  sortTsconfig,
  perfectionist,
  sortPackageJson
} from './configs';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings'
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli'
];

export const defaultPluginRenaming = {
  'n': 'node',
  'yml': 'yaml',
  'vitest': 'test',
  'import-x': 'import',

  '@stylistic': 'style',
  '@eslint-react': 'react',
  '@typescript-eslint': 'ts',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention'
};

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {}
  };
}

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function whoj(
  options: Omit<TypedFlatConfigItem, 'files'> & OptionsConfig = {},
  ...userConfigs: Awaitable<Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any>>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    componentExts = [],
    jsx: enableJsx = true,
    autoRenamePlugins = true,
    astro: enableAstro = false,
    react: enableReact = false,
    solid: enableSolid = false,
    regexp: enableRegexp = true,
    svelte: enableSvelte = false,
    unocss: enableUnoCSS = false,
    unicorn: enableUnicorn = true,
    gitignore: enableGitignore = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    typescript: enableTypeScript = isPackageExists('typescript')
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)

      console.log('[@whoj/eslint-config] Detected running in editor, some rules are disabled.');
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  if (stylisticOptions) {
    stylisticOptions.overrides = {
      ...(stylisticOptions.overrides || {}),
      'style/semi': [2, 'always'],
      'style/comma-dangle': ['off'],
      'style/spaced-comment': 'off',
      'style/quotes': ['error', 'single']
    };
  }

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = enableJsx;

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'whoj/gitignore',
        ...enableGitignore
      })]));
    }
    else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        strict: false,
        name: 'whoj/gitignore'
      })]));
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript');
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript')
    }),
    comments(),
    node(),
    jsdoc({
      stylistic: stylisticOptions
    }),
    imports({
      stylistic: stylisticOptions
    }),
    command(),

    // Optional plugins (installed but not enabled by default)
    perfectionist()
  );

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    componentExts.push('vue');
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      type: options.type,
      overrides: getOverrides(options, 'typescript')
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      lessOpinionated: options.lessOpinionated,
      overrides: getOverrides(options, 'stylistic')
    }));
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, 'test')
    }));
  }

  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
      overrides: getOverrides(options, 'vue')
    }));
  }

  if (enableReact) {
    configs.push(react({
      ...typescriptOptions,
      tsconfigPath,
      overrides: getOverrides(options, 'react')
    }));
  }

  if (enableSolid) {
    configs.push(solid({
      tsconfigPath,
      typescript: !!enableTypeScript,
      overrides: getOverrides(options, 'solid')
    }));
  }

  if (enableSvelte) {
    configs.push(svelte({
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
      overrides: getOverrides(options, 'svelte')
    }));
  }

  if (enableUnoCSS) {
    configs.push(unocss({
      ...resolveSubOptions(options, 'unocss'),
      overrides: getOverrides(options, 'unocss')
    }));
  }

  if (enableAstro) {
    configs.push(astro({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'astro')
    }));
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        stylistic: stylisticOptions,
        overrides: getOverrides(options, 'jsonc')
      }),
      sortPackageJson(),
      sortTsconfig()
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'yaml')
    }));
  }

  if (options.toml ?? true) {
    configs.push(toml({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'toml')
    }));
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown(
        {
          componentExts,
          overrides: getOverrides(options, 'markdown')
        }
      )
    );
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === 'boolean' ? {} : stylisticOptions
    ));
  }

  configs.push(
    disables()
  );

  if ('files' in options) {
    throw new Error('[@whoj/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.');
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig]);

  configs.push([{
    rules: {
      'eqeqeq': 'warn',
      'require-await': 'off',
      'no-useless-escape': 'warn'
    }
  }]);

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer
    .append(
      ...configs,
      ...userConfigs as any
    );

  if (autoRenamePlugins) {
    composer = composer
      .renamePlugins(defaultPluginRenaming);
  }

  if (isInEditor) {
    composer = composer
      .disableRulesFix([
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const'
      ], {
        builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules)
      });
  }

  return composer;
}
