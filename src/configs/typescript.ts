import process from 'node:process';

import type {
  OptionsFiles,
  OptionsOverrides,
  OptionsProjectType,
  TypedFlatConfigItem,
  OptionsComponentExts,
  OptionsTypeScriptWithTypes,
  OptionsTypeScriptParserOptions
} from '../types';

import { pluginAntfu } from '../plugins';
import { renameRules, interopDefault } from '../utils';
import { GLOB_TS, GLOB_TSX, GLOB_ASTRO_TS, GLOB_MARKDOWN } from '../globs';

export async function typescript(
  options: OptionsComponentExts & OptionsFiles & OptionsOverrides & OptionsProjectType & OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    type = 'app',
    overrides = {},
    componentExts = [],
    parserOptions = {},
    overridesTypeAware = {}
  } = options;

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map(ext => `**/*.${ext}`)
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS
  ];
  const tsconfigPath = options?.tsconfigPath
    ? options.tsconfigPath
    : undefined;
  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/unbound-method': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-floating-promises': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/switch-exhaustiveness-check': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/strict-boolean-expressions': ['error', { allowNullableObject: true, allowNullableBoolean: true }]
  };

  const [
    pluginTs,
    parserTs
  ] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser'))
  ] as const);

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      files,
      ...ignores ? { ignores } : {},
      name: `whoj/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          sourceType: 'module',
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          ...typeAware
            ? {
                tsconfigRootDir: process.cwd(),
                projectService: {
                  defaultProject: tsconfigPath,
                  allowDefaultProject: ['./*.js']
                }
              }
            : {},
          ...parserOptions as any
        }
      }
    };
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: 'whoj/typescript/setup',
      plugins: {
        whoj: pluginAntfu,
        ts: pluginTs as any
      }
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, filesTypeAware, ignoresTypeAware)
        ]
      : [
          makeParser(false, files)
        ],
    {
      files,
      name: 'whoj/typescript/rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          { '@typescript-eslint': 'ts' }
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          { '@typescript-eslint': 'ts' }
        ),
        'no-redeclare': 'off',
        'ts/ban-ts-comment': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-explicit-any': 'off',
        'no-use-before-define': 'off',
        'ts/no-dynamic-delete': 'off',
        'no-dupe-class-members': 'off',

        'ts/unified-signatures': 'off',
        'no-useless-constructor': 'off',
        'ts/no-extraneous-class': 'off',
        'ts/no-invalid-void-type': 'off',
        'ts/no-require-imports': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-useless-constructor': 'off',
        'ts/triple-slash-reference': 'off',
        'ts/no-dupe-class-members': 'error',
        'ts/no-unsafe-function-type': ['off'],
        'ts/no-wrapper-object-types': 'error',
        'ts/no-import-type-side-effects': 'error',
        'ts/explicit-function-return-type': ['off'],
        'ts/method-signature-style': ['warn', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful

        'ts/no-redeclare': ['error', { builtinGlobals: false }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/no-empty-object-type': ['warn', { allowInterfaces: 'always' }],
        'ts/no-use-before-define': ['error', { classes: false, variables: true, functions: false }],
        'ts/no-unused-expressions': ['warn', {
          allowTernary: true,
          allowShortCircuit: true,
          allowTaggedTemplates: true
        }],
        'ts/consistent-type-imports': ['error', {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports'
        }],

        ...(type === 'lib'
          ? {
              'ts/explicit-function-return-type': ['error', {
                allowIIFEs: true,
                allowExpressions: true,
                allowHigherOrderFunctions: true
              }]
            }
          : {}
        ),
        ...overrides
      }
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'whoj/typescript/rules-type-aware',
          rules: {
            ...typeAwareRules,
            ...overridesTypeAware
          }
        }]
      : []
  ];
}
