import globals from 'globals';

import type { OptionsOverrides, OptionsIsInEditor, TypedFlatConfigItem } from '../types';

import { pluginAntfu, pluginUnusedImports } from '../plugins';

export async function javascript(
  options: OptionsIsInEditor & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    isInEditor = false
  } = options;

  return [
    {
      name: 'whoj/javascript/setup',
      linterOptions: {
        reportUnusedDisableDirectives: true
      },
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true
          }
        },
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          window: 'readonly',
          document: 'readonly',
          navigator: 'readonly'
        }
      }
    },
    {
      name: 'whoj/javascript/rules',
      plugins: {
        'whoj': pluginAntfu,
        'unused-imports': pluginUnusedImports
      },
      rules: {
        'no-new': 'error',

        'no-var': 'error',

        'no-eval': 'error',
        'no-with': 'error',
        'no-alert': 'error',
        'no-octal': 'error',
        'no-proto': 'error',
        'no-undef': 'error',
        'no-caller': 'error',
        'no-debugger': 'error',
        'no-iterator': 'error',
        'no-new-func': 'error',
        'vars-on-top': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-ex-assign': 'error',
        'no-multi-str': 'error',
        'no-obj-calls': 'error',
        'no-sequences': 'error',
        'no-delete-var': 'error',
        'no-extra-bind': 'error',
        'no-undef-init': 'error',
        'prefer-spread': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-lone-blocks': 'error',
        'no-unreachable': 'error',
        'no-class-assign': 'error',
        'no-const-assign': 'error',
        'no-implied-eval': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-regex-spaces': 'error',
        'no-self-compare': 'error',
        'no-useless-call': 'error',
        'prefer-template': 'error',
        'yoda': ['error', 'never'],
        'block-scoped-var': 'error',
        'no-control-regex': 'error',
        'no-empty-pattern': 'error',
        'no-extend-native': 'error',
        'no-global-assign': 'error',
        'no-import-assign': 'error',
        'no-sparse-arrays': 'error',
        'no-throw-literal': 'error',
        'no-useless-catch': 'error',
        'constructor-super': 'error',
        'default-case-last': 'error',
        'eqeqeq': ['error', 'smart'],
        'no-duplicate-case': 'error',
        'no-invalid-regexp': 'error',
        'no-unsafe-finally': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-unsafe-negation': 'error',
        'prefer-rest-params': 'error',
        'symbol-description': 'error',
        'no-compare-neg-zero': 'error',
        'no-unreachable-loop': 'error',
        'no-array-constructor': 'error',
        'no-case-declarations': 'error',
        'no-loss-of-precision': 'error',
        'no-this-before-super': 'error',
        'array-callback-return': 'error',
        'no-dupe-class-members': 'error',
        'no-extra-boolean-cast': 'error',
        'no-prototype-builtins': 'error',
        'no-useless-constructor': 'error',
        'unicode-bom': ['error', 'never'],
        'no-irregular-whitespace': 'error',
        'no-unexpected-multiline': 'error',
        'no-useless-computed-key': 'error',
        'whoj/no-top-level-await': 'error',
        'no-empty-character-class': 'error',
        'no-useless-backreference': 'error',
        'no-async-promise-executor': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-shadow-restricted-names': 'error',
        'no-template-curly-in-string': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-unmodified-loop-condition': 'error',
        'prefer-promise-reject-errors': 'error',
        'no-misleading-character-class': 'error',
        'prefer-exponentiation-operator': 'error',
        'no-self-assign': ['error', { props: true }],
        'one-var': ['error', { initialized: 'never' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'dot-notation': ['error', { allowKeywords: true }],
        'no-redeclare': ['error', { builtinGlobals: false }],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
        'unused-imports/no-unused-imports': isInEditor ? 'warn' : 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],
        'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
        'accessor-pairs': ['error', { setWithoutGet: true, enforceForClassMembers: true }],
        'no-use-before-define': ['error', { classes: false, variables: true, functions: false }],
        'no-restricted-syntax': [
          'error',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment'
        ],
        'no-unused-expressions': ['error', {
          allowTernary: true,
          allowShortCircuit: true,
          allowTaggedTemplates: true
        }],
        'no-unused-vars': ['error', {
          vars: 'all',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true
        }],
        'prefer-arrow-callback': [
          'error',
          {
            allowUnboundThis: true,
            allowNamedFunctions: false
          }
        ],
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'prefer-const': [
          isInEditor ? 'warn' : 'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true
          }
        ],
        'no-restricted-globals': [
          'error',
          { name: 'global', message: 'Use `globalThis` instead.' },
          { name: 'self', message: 'Use `globalThis` instead.' }
        ],
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        'no-restricted-properties': [
          'error',
          { property: '__proto__', message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.' },
          { property: '__defineGetter__', message: 'Use `Object.defineProperty` instead.' },
          { property: '__defineSetter__', message: 'Use `Object.defineProperty` instead.' },
          { property: '__lookupGetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' },
          { property: '__lookupSetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' }
        ],

        ...overrides
      }
    }
  ];
}
