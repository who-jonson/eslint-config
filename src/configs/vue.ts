import { mergeProcessors } from 'eslint-merge-processors';

import type {
  OptionsVue,
  OptionsFiles,
  OptionsOverrides,
  OptionsStylistic,
  TypedFlatConfigItem,
  OptionsHasTypeScript
} from '../types';

import { GLOB_VUE } from '../globs';
import { interopDefault } from '../utils';

export async function vue(
  options: OptionsVue & OptionsFiles & OptionsOverrides & OptionsStylistic & OptionsHasTypeScript = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    vueVersion = 3,
    stylistic = true,
    files = [GLOB_VUE]
  } = options;

  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};

  const {
    indent = 2
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  const [
    pluginVue,
    parserVue,
    processorVueBlocks
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks'))
  ] as const);

  return [
    {
      name: 'whoj/vue/setup',
      plugins: {
        vue: pluginVue
      },
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          ref: 'readonly',
          toRef: 'readonly',
          watch: 'readonly',
          toRefs: 'readonly',
          computed: 'readonly',
          reactive: 'readonly',
          onMounted: 'readonly',
          shallowRef: 'readonly',
          defineEmits: 'readonly',
          defineProps: 'readonly',
          onUnmounted: 'readonly',
          watchEffect: 'readonly',
          defineExpose: 'readonly',
          shallowReactive: 'readonly'
        }
      }
    },
    {
      files,
      name: 'whoj/vue/rules',
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue']
        : mergeProcessors([
            pluginVue.processors['.vue'],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks
              }
            })
          ]),
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          sourceType: 'module',
          extraFileExtensions: ['.vue'],
          ecmaFeatures: {
            jsx: true
          },
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null
        }
      },
      rules: {
        ...pluginVue.configs.base.rules as any,

        ...vueVersion === 2
          ? {
              ...pluginVue.configs.essential.rules as any,
              ...pluginVue.configs['strongly-recommended'].rules as any,
              ...pluginVue.configs.recommended.rules as any
            }
          : {
              ...pluginVue.configs['vue3-essential'].rules as any,
              ...pluginVue.configs['vue3-strongly-recommended'].rules as any,
              ...pluginVue.configs['vue3-recommended'].rules as any
            },

        'vue/no-v-html': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-unused-refs': 'error',

        'vue/prefer-template': 'error',
        'vue/space-infix-ops': 'error',
        'vue/no-empty-pattern': 'error',
        'vue/no-sparse-arrays': 'error',
        'vue/require-prop-types': 'off',
        'vue/eqeqeq': ['error', 'smart'],
        'vue/no-useless-v-bind': 'error',
        'whoj/no-top-level-await': 'off',
        // this is deprecated
        'vue/component-tags-order': 'off',
        'vue/require-default-prop': 'off',
        'node/prefer-global/process': 'off',
        'vue/no-loss-of-precision': 'error',
        'vue/html-indent': ['error', indent],
        'vue/max-attributes-per-line': 'off',
        'vue/html-quotes': ['error', 'double'],
        'vue/no-irregular-whitespace': 'error',
        'vue/multi-word-component-names': 'off',
        'ts/explicit-function-return-type': 'off',
        'vue/dot-location': ['error', 'property'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/prefer-separate-static-class': 'error',
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
        'vue/block-order': ['error', {
          order: ['script', 'template', 'style']
        }],
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
        }],
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement'
        ],
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],

        ...stylistic
          ? {
              'vue/object-curly-newline': 'off',
              'vue/comma-style': ['error', 'last'],
              'vue/template-curly-spacing': 'error',
              'vue/block-spacing': ['error', 'always'],
              'vue/space-in-parens': ['error', 'never'],
              'vue/operator-linebreak': ['error', 'before'],
              'vue/array-bracket-spacing': ['error', 'never'],
              'vue/object-curly-spacing': ['error', 'always'],
              'vue/comma-dangle': ['error', 'always-multiline'],
              'vue/quote-props': ['error', 'consistent-as-needed'],
              'vue/padding-line-between-blocks': ['error', 'always'],
              'vue/arrow-spacing': ['error', { after: true, before: true }],
              'vue/comma-spacing': ['error', { after: true, before: false }],
              'vue/keyword-spacing': ['error', { after: true, before: true }],
              'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
              'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
              'vue/html-comment-content-spacing': ['error', 'always', {
                exceptions: ['-']
              }],
              'vue/block-tag-newline': ['error', {
                multiline: 'always',
                singleline: 'always'
              }]
            }
          : {},

        ...overrides
      }
    }
  ];
}
